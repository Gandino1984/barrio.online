import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import product_model from "./product_model.js";
import orders_model from "./orders_model.js";

const user_model = sequelize.define("user", {
    id_user: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name_user: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    pass_user: {
        type: DataTypes.STRING(255), 
        allowNull: false
    },
    location_user: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    type_user: {
        type: DataTypes.ENUM('customer', 'seller', 'admin'), 
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
});

user_model.belongsToMany(product_model, {
    through: orders_model,
    foreignKey: 'id_user'
});

product_model.belongsToMany(user_model, {
    through: orders_model,
    foreignKey: 'id_product'
});

// User - Shop
user_model.hasMany(shop_model, {
    foreignKey: 'id_user'
});

shop_model.belongsTo(user_model, {
    foreignKey: 'id_user'
});

export default user_model;