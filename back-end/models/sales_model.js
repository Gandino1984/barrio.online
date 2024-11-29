import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import shop_model from "./shop_model.js";
import user_model from "./user_model.js";
import product_model from "./product_model.js";

const sales_model = sequelize.define("sales", {
    id_sales: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_shop: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    id_user: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    id_product: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    sale_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
});


export default sales_model;