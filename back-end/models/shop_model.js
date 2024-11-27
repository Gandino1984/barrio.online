import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import user_model from "./user_model.js";

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

// Add the belongsTo relation to the user model
shop_model.belongsTo(user_model, {
    foreignKey: 'id_user',
    as: 'owner', // This allows you to use include: ['owner'] when querying
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
});

// Optionally, add a reverse relation on the user model
user_model.hasMany(shop_model, {
    foreignKey: 'id_user',
    as: 'shops', // This allows you to use include: ['shops'] when querying
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION'
});

export default shop_model;