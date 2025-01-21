import { Request, Response } from "express";
import { statusCode } from "../../config/constants";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../../utility/customResponse";
import { sequelize } from "../../database";
import UserModel from "../user/model";

/**
 * Handles a basic get request and sends a response with a status, message.
 * @param {object} req - The request object containing information about the HTTP request.
 * @param {object} res - The response object used to send the HTTP response.
 * @returns { { status: string; message: string; data: Array<any> | null } } - The HTTP response with the status, message and empty data array.
 * @author Vinay Sawardekar <https://www.linkedin.com/in/vinay-sawardekar/>
 */
const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  /**
   * #swagger.tags = ["User"]
   * #swagger.summary = 'Fetch All Users!!'
   */
  try {
    const user = UserModel(sequelize);
    const data = await user.findAll({ raw: true });
    const message = `Fetched all users.`;
    const response = createSuccessResponse(message, data);
    return res.status(statusCode.OK).send(response);
  } catch (error) {
    const message = `Internal Server Error`;
    const response = createErrorResponse(message);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(response);
  }
};

export { getAllUsers };
