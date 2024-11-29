import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import user_model from "./user_model.js";
import product_model from "./product_model.js";

const orders_model = sequelize.define("orders", {
    id_order: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_user: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    id_product: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    delivery_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    finished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    timestamps: false,
    freezeTableName: true
});

export default orders_model;