import { NextFunction, Request, Response } from "express";
import { statusCode } from "../config/constants";
import { createErrorResponse } from "../utility/customResponse";
import UserModel from "../modules/user/model";
import GroceryModel from "../modules/grocery/model";
import { sequelize } from "../database";

/**
 * Middleware function to check if the user is an admin or not.
 * If the user is an admin, it calls the next function in the middleware chain.
 * If the user is not an admin, it sends an unauthorized response.
 *
 * @param {Request} req - The request object containing information about the HTTP request.
 * @param {Response} res - The response object used to send the HTTP response.
 * @param {NextFunction} next - The callback function that will be called if the middleware function has finished running.
 */
const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let user_id: string = req.body.user_id;
    if (!user_id) {
      user_id = req.params.user_id;
    }

    const user = UserModel(sequelize);
    const user_data = await user.findOne({
      where: {
        id: user_id,
      },
    });

    if (user_data?.dataValues && user_data?.dataValues.role === "admin") {
      next();
    } else {
      const message = `Unauthorized access`;
      const response = createErrorResponse(message);
      return res.status(statusCode.UNAUTHORIZED).send(response);
    }
  } catch (error) {
    const message = `Internal Server Error`;
    const response = createErrorResponse(message);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(response);
  }
};

/**
 * Middleware function to check if the grocery product with given id exists or not.
 * If the product exists, it calls the next function in the middleware chain.
 * If the product does not exist, it sends a bad request response.
 *
 * @param {Request} req - The request object containing information about the HTTP request.
 * @param {Response} res - The response object used to send the HTTP response.
 * @param {NextFunction} next - The callback function that will be called if the middleware function has finished running.
 */
const isExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id: string = req.params.id;
    const grocery = GroceryModel(sequelize);

    const isExist = await grocery.findOne({
      where: {
        id,
      },
    });

    if (isExist == null || isExist.dataValues.length === 0) {
      const message = `Grocery Not found`;
      const response = createErrorResponse(message);
      return res.status(statusCode.BAD_REQUEST).send(response);
    } else {
      next();
    }
  } catch (error) {
    const message = `Internal Server Error`;
    const response = createErrorResponse(message);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(response);
  }
};
export { isAdmin, isExist };
