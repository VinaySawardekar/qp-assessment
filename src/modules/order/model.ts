import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  const Order = sequelize.define("Order", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["created", "cancelled", "delivered"],
      defaultValue: "created",
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.FLOAT(10, 2),
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
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Order;
};
