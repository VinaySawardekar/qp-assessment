import { Request, Response } from "express";
import { statusCode } from "../../config/constants";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../../utility/customResponse";
import { sequelize } from "../../database";
import OrderModel from "../order/model";
import OrderItemsModel from "../orderItems/model";
import GroceryModel from "../grocery/model";
import customLogger from "../../utility/logger";
import { createOrderSchema } from "./schema";
import { orderType } from "../../types/orderTypes";

/**
 * Fetch all Orders from the database
 *
 * @description
 * Handles a basic get request and sends a response with a status, message..
 * @param {object} req - The request object containing information about the HTTP request.
 * @param {object} res - The response object used to send the HTTP response.
 * @returns { { status: string; message: string; data: Array<any> | null } } - The HTTP response with the status, message and empty data array.
 * @author Vinay Sawardekar <https://www.linkedin.com/in/vinay-sawardekar/>
 */
const getOrderList = async (req: Request, res: Response): Promise<Response> => {
  /**
   * #swagger.tags = ["Order"]
   * #swagger.summary = 'Fetch List of Orders Placed'
   */
  try {
    const order = OrderModel(sequelize);
    const data = await order.findAll({ raw: true });

    const message = `Fetched all Orders.`;
    const response = createSuccessResponse(message, data);
    return res.status(statusCode.OK).send(response);
  } catch (error) {
    const message = `Internal Server Error`;
    const response = createErrorResponse(message);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(response);
  }
};

/**
 * Creates new order for the user.
 *
 * @description
 * This API handles the creation of a new order for a user. It follows these steps:
 * 1. Extracts items, user_id, and address from the request body.
 * 2. Validates the request data using the createOrderSchema.
 * 3. If validation fails, logs the error and returns a 422 status with the error details.
 * 4. If validation is successful, creates a new order record with a temporary total_amount of 0.
 * 5. Iterates over each item in the order:
 *    a. Retrieves the grocery item details from the database.
 *    b. Calculates the item amount and updates the total order amount.
 *    c. Creates a new order item record for each grocery item.
 *    d. Updates the inventory quantity of the grocery item.
 * 6. Updates the order record with the computed total_amount.
 * 7. Retrieves the newly created order data from the database.
 * 8. Returns a successful response with the order data.
 * 9. If any error occurs during the process, returns a 500 error with a generic error message.
 *
 * @param {object} req - The request object containing information about the HTTP request.
 * @param {object} res - The response object used to send the HTTP response.
 * @returns { { status: string; message: string; data: Array<any> | null } } - The HTTP response with the status, message and order data.
 * @author Vinay Sawardekar <https://www.linkedin.com/in/vinay-sawardekar/>
 */
const createOrder = async (req: Request, res: Response): Promise<Response> => {
  /**
   * #swagger.tags = ["Order"]
   * #swagger.summary = 'Create New Order'
   */
  try {
    // Step 1: Extracts items, user_id, and address from the request body.
    const { items, user_id, address }: orderType = req.body;

    // Step 2: Validate request data
    const { error } = createOrderSchema.validate(req.body);
    // Step 3: If validation fails, logs the error and returns a 422 status with the error details.
    if (error) {
      const message = `Validation Failed! Invalid request data`;
      const response = createSuccessResponse(message, [error]);
      return res.status(statusCode.UNPROCESSABLE_ENTITY).send(response);
    }

    const order = OrderModel(sequelize);
    const grocery = GroceryModel(sequelize);

    // Step 4: Create a new order with temporary total_amount
    const data = await order.create({
      total_amount: 0,
      user_id: user_id,
      address: address,
    });

    let total_amount: number = 0;

    // Step 5: Process each item
    if (items.length > 0) {
      const orderItems = OrderItemsModel(sequelize);
      for (let i = 0; i < items.length; i++) {
        const groceryData = await grocery.findOne({
          where: {
            id: items[i].grocery_id,
          },
        });

        // Step 5b: Calculate item amount and update total amount
        let amount: number =
          parseFloat(groceryData?.dataValues.price) * items[i].quantity;
        total_amount += amount;

        const updatedQuantity =
          parseInt(groceryData?.dataValues.quantity) - items[i].quantity;

        // Step 5c: Create order item record
        await orderItems.create({
          user_id: user_id,
          order_id: data.dataValues.id,
          grocery_id: items[i].grocery_id,
          quantity: items[i].quantity,
          price: amount,
        });

        // Step 5d: Update inventory
        await grocery.update(
          { quantity: updatedQuantity },
          {
            where: {
              id: items[i].grocery_id,
            },
          },
        );
      }
    }

    // Step 6: Update order with total_amount
    await order.update(
      {
        total_amount,
      },
      {
        where: {
          id: data.dataValues.id,
        },
      },
    );

    // Step 7: Retrieve newly created order
    const result = await order.findOne({
      where: {
        id: data.dataValues.id,
      },
      raw: true,
    });

    // Step 8: Send success response
    const message = `Placed new order.`;
    const response = createSuccessResponse(message, [result]);
    return res.status(statusCode.CREATED).send(response);
  } catch (error) {
    // Step 9: Handle errors
    const message = `Internal Server Error`;
    const response = createErrorResponse(message);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(response);
  }
};

export { createOrder, getOrderList };
