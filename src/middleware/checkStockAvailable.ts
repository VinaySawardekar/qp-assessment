import { NextFunction, Request, Response } from "express";
import { statusCode } from "../config/constants";
import { createErrorResponse } from "../utility/customResponse";
import UserModel from "../modules/user/model";
import GroceryModel from "../modules/grocery/model";
import { sequelize } from "../database";
import { itemsType } from "../types/orderTypes";

/**
 * This middleware function checks whether the grocery items requested in the order has enough stock available in the inventory
 * @param {Request} req - The request object containing information about the HTTP request.
 * @param {Response} res - The response object used to send the HTTP response.
 * @param {NextFunction} next - The callback function that will be called if the middleware function has finished running.
 * @author Vinay Sawardekar <https://www.linkedin.com/in/vinay-sawardekar/>
 */
const checkGroceryStock = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const items: Array<itemsType> = req.body.items;

    const grocery = GroceryModel(sequelize);
    for (let i = 0; i < items.length; i++) {
      const groceryData = await grocery.findOne({
        where: {
          id: items[i].grocery_id,
        },
      });
      if (
        groceryData?.dataValues &&
        groceryData?.dataValues.quantity >= items[i].quantity
      ) {
        next();
      } else if (items[i].quantity <= 0) {
        const message = `${groceryData?.dataValues.name} quantity should be greater than 0.`;
        const response = createErrorResponse(message);
        return res.status(statusCode.BAD_REQUEST).send(response);
      } else if (groceryData?.dataValues.quantity === 0) {
        const message = `${groceryData?.dataValues.name} is Out of Stock.`;
        const response = createErrorResponse(message);
        return res.status(statusCode.BAD_REQUEST).send(response);
      } else {
        const message = `${groceryData?.dataValues.name} don't have enough quantity.`;
        const response = createErrorResponse(message);
        return res.status(statusCode.BAD_REQUEST).send(response);
      }
    }
  } catch (error) {
    const message = `Internal Server Error`;
    const response = createErrorResponse(message);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(response);
  }
};

export { checkGroceryStock };
