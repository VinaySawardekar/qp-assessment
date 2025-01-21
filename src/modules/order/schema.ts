import Joi, { ArraySchema, ObjectSchema } from "joi";
import { itemsType, orderType } from "../../types/orderTypes";

/**
 * Validation schema for items.
 * @typedef {Object} ItemSchema
 * @property {number} grocery_id - The ID of the user creating the order.
 * @property {number} quantity - The address of the order.
 */

const ItemSchema: ArraySchema<itemsType[]> = Joi.array().items(
  Joi.object().keys({
    grocery_id: Joi.number().required().greater(0),
    quantity: Joi.number().required().greater(0),
  }),
);

/**
 * Validation schema for creating a new order.
 * @typedef {Object} CreateOrderSchema
 * @property {Array<itemsType>} items - An array of objects containing the grocery item id and quantity.
 * @property {number} user_id - The ID of the user creating the order.
 * @property {string} address - The address of the order.
 */
const createOrderSchema: ObjectSchema<orderType> = Joi.object().keys({
  items: ItemSchema,
  user_id: Joi.number().required().greater(0),
  address: Joi.string().required(),
});

export { createOrderSchema };
