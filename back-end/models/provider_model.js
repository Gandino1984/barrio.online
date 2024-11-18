import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import product_model from "./product_model.js";
import shop_model from "./shop_model.js";


const provider_model = sequelize.define("provider", {
    id_provider: { 
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name_provider: { 
        type: DataTypes.STRING(100),
        allowNull: false
    },
    location_provider: { 
        type: DataTypes.STRING(45),
        allowNull: false
    },
    pass_provider: { 
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
});

// Shop - Provider (through Buys)
shop_model.belongsToMany(provider_model, {
    through: 'buys',
    foreignKey: 'id_shop'
});

provider_model.belongsToMany(shop_model, {
    through: 'buys',
    foreignKey: 'id_provider'
});

// Provider - Product (through Produce)
provider_model.belongsToMany(product_model, {
    through: 'produce',
    foreignKey: 'id_provider'
});

product_model.belongsToMany(provider_model, {
    through: 'produce',
    foreignKey: 'id_product'
});

export default provider_model