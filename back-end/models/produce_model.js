import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import provider_model from "./provider_model.js";
import product_model from "./product_model.js";

const produce_model = sequelize.define("produce", {
    id_produce: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_provider: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    id_product: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
});

export default produce_model;
produce_model.belongsTo(provider_model, { foreignKey: 'id_provider', as: 'provider' });
produce_model.belongsTo(product_model, { foreignKey: 'id_product', as: 'product' });
