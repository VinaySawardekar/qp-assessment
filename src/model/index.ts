import { Sequelize } from "sequelize";
import UserModel from "../modules/user/model";
import GroceryItemsModel from "../modules/grocery/model";
import OrderModel from "../modules/order/model";
import OrderItemsModel from "../modules/orderItems/model";

/**
 * Sync all models with the DB.
 *
 * @description
 * Sync all models with the DB.
 * Steps Performed in this function are as follows:
 * - Step 1. Synchronize models
 * - Step 2. Create User with "admin" role if doesnt exist
 * - Step 3. Create User with "user" role if doesnt exist
 *
 * @param {Sequelize} sequelize The Sequelize instance to use.
 *
 * @returns {Promise<Object>} An object with the models as properties.
 * @throws {Error} If there is an issue syncing the models.
 */
const syncModels = async (sequelize: Sequelize): Promise<object> => {
  try {
    /** Step 1: Synchronize models (Read method description for more details.) */
    const User = UserModel(sequelize);
    const GroceryItems = GroceryItemsModel(sequelize);
    const Order = OrderModel(sequelize);
    const OrderItems = OrderItemsModel(sequelize);
    const res = await sequelize.sync();

    if (Array(res.models).length > 0) {
      // Creating Default Users
      /** Step 2: Create User with "admin" role if doesnt exist (Read method description for more details.) */
      await User.findOrCreate({
        where: {
          username: "admin",
          first_name: "Test",
          last_name: "Admin",
          role: "admin",
          email: "admin@user.com",
        },
      });
      /** Step 3: Create User with "user" role if doesnt exist (Read method description for more details.) */
      await User.findOrCreate({
        where: {
          username: "user",
          first_name: "Test",
          last_name: "User",
          email: "user@user.com",
        },
      });
    }

    return {
      User,
      GroceryItems,
      Order,
      OrderItems,
    };
  } catch (error: any) {
    console.error("Unable to create table : ", error);
    throw error;
  }
};

export default syncModels;
