import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  const OrderItems = sequelize.define("OrderItems", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    price: {
      type: DataTypes.FLOAT(10, 2),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // 'user' refers to table name
        key: "id", // 'id' refers to column name in users table
      },
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Orders", // 'user' refers to table name
        key: "id", // 'id' refers to column name in users table
      },
    },
    grocery_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "GroceryItems", // 'user' refers to table name
        key: "id", // 'id' refers to column name in users table
      },
    },
  });

  return OrderItems;
};
