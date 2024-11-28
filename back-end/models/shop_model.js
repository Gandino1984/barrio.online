import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import user_model from "../models/user_model.js";
import buys_model from "../models/buys_model.js";


const shop_model = sequelize.define("shop", {
    id_shop: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name_shop: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    location_shop: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    type_shop: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    id_user: { 
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    calification_shop: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 5
        }
    }
}, {
    timestamps: false,
    freezeTableName: true
});


export default shop_model;