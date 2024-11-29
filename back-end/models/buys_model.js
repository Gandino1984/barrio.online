import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import shop_model from "./shop_model.js";
import provider_model from "./provider_model.js";

const buys_model = sequelize.define("buys", {
    id_buys: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_shop: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    id_provider: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
});

export default buys_model;