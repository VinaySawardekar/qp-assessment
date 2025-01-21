import { DataTypes, Model, Sequelize } from "sequelize";
import { categories } from "../../config/constants";

export default (sequelize: Sequelize) => {
  const GroceryItems = sequelize.define("GroceryItems", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM,
      values: categories,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // 'user' refers to table name
        key: "id", // 'id' refers to column name in users table
      },
    },
  });

  return GroceryItems;
};
