import { Sequelize } from "sequelize";
import syncModels from "../model/index";
import { environment } from "../config/environment";
import customLogger from "../utility/logger";

const user = environment.config.DB_USER;
const password = environment.config.DB_PASSWORD;
const host = environment.config.DB_HOST;
const database = environment.config.DB_NAME;
const port = environment.config.DB_PORT;

const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: "mysql",
  logging: false,
});

/**
 * Establishes a connection to the MySQL database and synchronizes the Sequelize models.
 *
 * @returns {Promise<void>} - A promise that resolves when the database connection is established.
 *
 * @throws Will throw an error if the connection to the MySQL database cannot be established.
 *
 * @description
 * This function first authenticates the Sequelize connection and then synchronizes the
 * Sequelize models. This ensures that the tables are created if they don't exist.
 * Steps Performed in this function are as follows:
 * - 1. Authenticate the Sequelize connection
 * - 2. Synchronize models
 *
 * @author Vinay Sawardekar <https://www.linkedin.com/in/vinay-sawardekar/>
 */
const connectToDatabase = async (): Promise<void> => {
  try {
    /* Step 1: Authenticate the Sequelize connection (Read method description for more details.) */
    await sequelize.authenticate();
    customLogger.log("info", `Database connection established`);

    /* Step 2: Synchronize models (ensure tables are created if they don't exist) (Read method description for more details.) */
    await syncModels(sequelize);
  } catch (error: any) {
    console.error("Unable to connect to the database: ", error);
    throw error;
  }
};

export { sequelize, connectToDatabase };
