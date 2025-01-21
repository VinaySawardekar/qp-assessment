import Joi, { ObjectSchema } from "joi";
import { categories } from "../../config/constants";
import { groceryItem } from "../../types/groceryTypes";

/**
 * Validation schema for creating a new grocery item.
 * @typedef {Object} CreateGrocerySchema
 * @property {number} user_id - The ID of the user creating the grocery item.
 * @property {string} name - The name of the grocery item.
 * @property {number} price - The price of the grocery item.
 * @property {number} quantity - The quantity of the grocery item.
 * @property {string} category - The category of the grocery item.
 */
export const createGrocerySchema: ObjectSchema<groceryItem> = Joi.object().keys(
  {
    user_id: Joi.number(),
    name: Joi.string().required(),
    price: Joi.number().required().greater(0),
    quantity: Joi.number().required().greater(0),
    category: Joi.string()
      .required()
      .valid(...categories),
  },
);

/**
 * Validation schema for updating an existing grocery item.
 * @typedef {Object} UpdateGrocerySchema
 * @property {string} name - The new name of the grocery item.
 * @property {number} price - The new price of the grocery item.
 * @property {number} quantity - The new quantity of the grocery item.
 * @property {string} category - The new category of the grocery item.
 */
export const updateGrocerySchema: ObjectSchema<groceryItem> = Joi.object().keys(
  {
    user_id: Joi.number().required(),
    name: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    category: Joi.string().required(),
  },
);
