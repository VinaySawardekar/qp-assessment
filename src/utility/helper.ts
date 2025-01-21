import mysql, { Pool } from "mysql2/promise";
import customLogger from "../utility/logger";
import { environment } from "../config/environment";

const { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT } = environment.config;

/**
 * @description
 * Initializes the database by performing the following steps:
 *
 * 1. Establishes a connection using the provided database credentials.
 * 2. Creates the database if it doesn't exist.
 * 3. Switches to the newly created or existing database.
 * 4. Closes the database connection.
 *
 * @returns {Promise<void>} - A promise that resolves when the database has been initialized.
 *
 * @throws Will throw an error if the database can't be initialized.
 *
 * @author Vinay Sawardekar <https://www.linkedin.com/in/vinay-sawardekar/>
 */
const initializeDB = async (): Promise<void> => {
  try {
    // Step 1: Establish a connection using the provided database credentials.
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT,
    });

    // Step 2: Create the database if it doesn't exist.
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME};`);
    customLogger.log(
      "info",
      `Database '${DB_NAME}' checked/created successfully.`,
    );

    // Step 3: Switch to the newly created or existing database.
    await connection.query(`USE ${DB_NAME};`);

    // Step 4: Close the database connection.
    await connection.end();
  } catch (error: any) {
    customLogger.log("error", `Error initializing database: ${error.message}`);
    throw error;
  }
};

export { initializeDB };
