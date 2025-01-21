import { Request, Response } from "express";
import { statusCode } from "../../config/constants";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../../utility/customResponse";
import { sequelize } from "../../database";
import GroceryModel from "../grocery/model";
import { categories } from "../../config/constants";
import { createGrocerySchema, updateGrocerySchema } from "./schema";
import customLogger from "../../utility/logger";
import { groceryItem } from "../../types/groceryTypes";

/**
 * Fetches all the grocery items from the database.
 *
 * @description
 * It fetched all the grocery items from the database.
 *
 * @param {object} req - The request object containing information about the HTTP request.
 * @param {object} res - The response object used to send the HTTP response.
 * @returns { { status: string; message: string; data: Array<any> | null } } - The HTTP response with the status, message and empty data array.
 * @author Vinay Sawardekar <https://www.linkedin.com/in/vinay-sawardekar/>
 */
const getGroceryList = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  /**
   * #swagger.tags = ["Grocery"]
   * #swagger.summary = 'Fetch List of Groceries'
   * #swagger.description = 'This API fetches all the grocery items from the database. The response contains an array of grocery item objects.'
   */
  try {
    const grocery = GroceryModel(sequelize);
    const data = await grocery.findAll({ raw: true });
    const message = `Fetched all Grocery Products.`;
    const response = createSuccessResponse(message, data);
    return res.status(statusCode.OK).send(response);
  } catch (error) {
    const message = `Internal Server Error`;
    const response = createErrorResponse(message);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(response);
  }
};

/**
 * Creates a new grocery product in the database.
 *
 * @description
 * This function follows these steps to create a new grocery product in the database:
 * 1. Validates the request body using the createGrocerySchema.
 * 2. Checks if the provided category exists.
 * 3. Creates a new grocery product in the database.
 * 4. If successful, it returns a success response with the created grocery product data.
 * 5. In case of validation failure or any error, it returns an appropriate error response.
 *
 * @param {Request} req - The request object containing information about the HTTP request.
 * @param {Response} res - The response object used to send the HTTP response.
 * @returns {Promise<Response>} - A promise that resolves with the HTTP response, either success or error.
 * @throws {Error} - Throws an error if there is an internal server error.
 */
const createGroceryProduct = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  /**
   * #swagger.tags = ["Grocery"]
   * #swagger.summary = 'Create New Grocery Item'
   * #swagger.description = 'This API creates a new grocery item. The request body should contain the name, price, quantity, category and user_id of the item to be created.'
   */
  try {
    const { name, price, quantity, category, user_id }: groceryItem = req.body;

    // Step 1: Validate request body
    const { error } = createGrocerySchema.validate(req.body);
    if (error) {
      const message = `Validation Failed! Invalid request data`;
      const response = createSuccessResponse(message, [error]);
      return res.status(statusCode.UNPROCESSABLE_ENTITY).send(response);
    }

    // Step 2: Check if category exists
    if (!categories.includes(category)) {
      const message = `Category Didn't Exists.`;
      const response = createErrorResponse(message);
      return res.status(statusCode.UNPROCESSABLE_ENTITY).send(response);
    }

    // Step 3: Create a new grocery product
    const grocery = GroceryModel(sequelize);
    const data = await grocery.create({
      name,
      price,
      quantity,
      category,
      created_by: user_id,
    });

    // Step 4: If successful, it returns a success response with the created grocery product data.
    const message = `Create new grocery product.`;
    const response = createSuccessResponse(message, [data]);
    return res.status(statusCode.CREATED).send(response);
  } catch (error) {
    // Step 5. In case of validation failure or any error, it returns an appropriate error response.
    const message = `Internal Server Error`;
    const response = createErrorResponse(message);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(response);
  }
};

/**
 * Deletes a grocery item from the grocery list.
 *
 * @description
 * This function follows these steps to delete a grocery item from the grocery list:
 * 1. Checks if the grocery item with the given id exists.
 * 2. If the grocery item exists, it deletes the grocery item from the database.
 * 3. If successful, it returns a success response with the deleted grocery item data.
 * 4. In case of validation failure or any error, it returns an appropriate error response.
 *
 * @param {number} id - The ID of the grocery item to be deleted.
 * @param {Request} req - The request object containing information about the HTTP request.
 * @param {Response} res - The response object used to send the HTTP response.
 * @returns {Promise<Response>} - A promise that resolves with the HTTP response, either success or error.
 * @throws {Error} - Throws an error if there is an internal server error.
 */
const deleteGroceryProduct = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  /**
   * #swagger.tags = ["Grocery"]
   * #swagger.summary = 'Delete Grocery Item'
   * #swagger.description = 'This API deletes a grocery item from the grocery list. The ID of the grocery item to be deleted is passed as a parameter in the URL.'
   */
  try {
    const { id } = req.params;
    const grocery = GroceryModel(sequelize);

    // Step 1: Check if the grocery item with the given id exists
    const isExist = await grocery.findOne({
      where: {
        id: id,
      },
    });

    // Step 2: If the grocery item exists, it deletes the grocery item from the database
    const data = await grocery.destroy({
      where: {
        id,
      },
    });

    // Step 3: If successful, it returns a success response with the deleted grocery item data
    if (data == 1) {
      const message = `${isExist?.dataValues.name} is deleted from the grocery list.`;
      const response = createSuccessResponse(message, []);
      return res.status(statusCode.OK).send(response);
    } else {
      const message = `${isExist?.dataValues.name} is unable to delete from the grocery list.`;
      const response = createErrorResponse(message);
      return res.status(statusCode.BAD_REQUEST).send(response);
    }
  } catch (error) {
    // Step 4: In case of validation failure or any error, it returns an appropriate error response
    const message = `Internal Server Error`;
    const response = createErrorResponse(message);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(response);
  }
};

/**
 * This API updates a grocery item in the grocery list.
 *
 * @description
 * This function follows these steps to update a grocery item in the database:
 * 1. Extracts the grocery item ID from the request parameters and the fields to be updated from the request body.
 * 2. Validates the request body using the updateGrocerySchema.
 * 3. Checks if the provided category exists.
 * 4. Updates the grocery item in the database with the new data.
 * 5. If successful, it returns a success response with the updated grocery item data.
 * 6. In case of validation failure or any error, it returns an appropriate error response.
 *
 * @param {Request} req - The request object containing information about the HTTP request.
 * @param {Response} res - The response object used to send the HTTP response.
 * @returns {Promise<void>} - A promise that resolves with the HTTP response, either success or error.
 * @throws {Error} - Throws an error if there is an internal server error.
 */
const updateGroceryProduct = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  /**
   * #swagger.tags = ["Grocery"]
   * #swagger.summary = 'Update Grocery Item'
   * #swagger.description = 'This API updates a grocery item in the grocery list. The ID of the grocery item to be updated is passed as a parameter in the URL and the fields to be updated are passed in the request body.'
   */
  try {
    // Step 1: Extracts the grocery item ID and fields to be updated
    const { id } = req.params;
    const { name, price, quantity, category }: groceryItem = req.body;

    // Step 2: Validate the request body
    const { error } = updateGrocerySchema.validate(req.body);
    if (error) {
      const message = `Validation Failed! Invalid request data`;
      const response = createSuccessResponse(message, [error]);
      return res.status(statusCode.UNPROCESSABLE_ENTITY).send(response);
    }

    const grocery = GroceryModel(sequelize);

    // Step 3: Check if the provided category exists
    if (!categories.includes(category)) {
      const message = `Category Didn't Exists.`;
      const response = createErrorResponse(message);
      return res.status(statusCode.UNPROCESSABLE_ENTITY).send(response);
    }

    // Step 4: Update the grocery item in the database
    const data = await grocery.update(
      {
        name,
        price,
        quantity,
        category,
      },
      {
        where: {
          id,
        },
      },
    );

    // Step 5: If successful, returns a success response with the updated grocery item data
    const message = `Updated grocery product of id ${id}.`;
    const response = createSuccessResponse(message, []);
    return res.status(statusCode.OK).send(response);
  } catch (error) {
    // Step 6: In case of validation failure or any error, returns an appropriate error response
    const message = `Internal Server Error`;
    const response = createErrorResponse(message);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(response);
  }
};

/**
 * Fetches a grocery item by its ID.
 *
 * @description
 * This function follows these steps to fetch a grocery item by its ID:
 * 1. Extracts the grocery item ID from the request parameters.
 * 2. Uses the GroceryModel to fetch the grocery item by its ID.
 * 3. If the grocery item exists, it returns a success response with the fetched data.
 * 4. In case of any error, it returns an appropriate error response.
 *
 * @param {number} id - The ID of the grocery item to be fetched.
 * @returns {object} A JSON response with a status, message and the fetched data.
 * @throws {Error} If there is an internal server error.
 */
const fetchGroceryProductById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  /**
   * #swagger.tags = ["Grocery"]
   * #swagger.summary = 'Fetch Grocery Item By ID'
   * #swagger.description = 'This API fetches a grocery item by its ID. The ID of the grocery item to be fetched is passed as a parameter in the URL.'
   */
  try {
    // Step 1: Extract the grocery item ID from the request parameters
    const { id } = req.params;

    // Step 2: Use the GroceryModel to fetch the grocery item by its ID
    const grocery = GroceryModel(sequelize);
    const data = await grocery.findOne({
      where: {
        id,
      },
    });

    // Step 3: If the grocery item exists, return a success response with the fetched data
    if (data) {
      const message = `Fetched grocery product of id ${id}.`;
      const response = createSuccessResponse(message, [data]);
      return res.status(statusCode.OK).send(response);
    } else {
      const message = `Grocery item of id ${id} not found.`;
      const response = createErrorResponse(message);
      return res.status(statusCode.NOT_FOUND).send(response);
    }
  } catch (error) {
    // Step 4: In case of any error, return an appropriate error response
    const message = `Internal Server Error`;
    const response = createErrorResponse(message);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(response);
  }
};

/**
 * Updates the inventory quantity of a specific grocery item.
 *
 * This function follows these steps to update the inventory:
 * 1. Retrieves the current quantity of the grocery item specified by the ID parameter.
 * 2. Adds the provided quantity from the request body to the current quantity.
 * 3. Updates the inventory with the new quantity.
 *
 * @param {Request} req - The request object containing the grocery item ID
 *                        in the URL parameters and the quantity to update
 *                        in the request body.
 * @param {Response} res - The response object used to send the HTTP response.
 * @returns {object} A JSON response with a status and message indicating
 *                   the success or failure of the inventory update.
 * @throws {Error} If there is an internal server error.
 */

const updateGroceryInventory = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  /**
   * #swagger.tags = ["Grocery"]
   * #swagger.summary = 'Update Grocery Item Inventory'
   * #swagger.description = 'This API updates a grocery quantity by its ID. The ID of the grocery item to be fetched is passed as a parameter in the URL.'
   */
  try {
    const { id } = req.params;
    const quantity: number = req.body.quantity;
    if (isNaN(quantity)) {
      const message = `Invalid quantity provided`;
      const response = createErrorResponse(message);
      return res.status(statusCode.UNPROCESSABLE_ENTITY).send(response);
    }
    const grocery = GroceryModel(sequelize);

    // Step 1: Retrieves the current quantity of the grocery item specified by the ID parameter
    const data = await grocery.findOne({
      where: {
        id,
      },
    });
    // Step 2: Adds the provided quantity from the request body to the current quantity
    const updatedQuantity = parseInt(data?.dataValues.quantity) + quantity;

    // Step 3: Updates the inventory with the new quantity
    await grocery.update(
      {
        quantity: updatedQuantity,
      },
      {
        where: {
          id,
        },
      },
    );

    const message = `Updated inventory size of ${quantity} for product of id ${id}.`;
    const response = createSuccessResponse(message, []);
    return res.status(statusCode.OK).send(response);
  } catch (error) {
    const message = `Internal Server Error`;
    const response = createErrorResponse(message);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(response);
  }
};
export {
  getGroceryList,
  createGroceryProduct,
  deleteGroceryProduct,
  updateGroceryProduct,
  fetchGroceryProductById,
  updateGroceryInventory,
};
