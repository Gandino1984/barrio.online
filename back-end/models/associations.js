import user_model from './user_model.js';
import product_model from './product_model.js';
import shop_model from './shop_model.js';
import sales_model from './sales_model.js';
import orders_model from './orders_model.js';
import buys_model from './buys_model.js';
import provider_model from './provider_model.js';
import produce_model from './produce_model.js';

function setupAssociations() {
    // User Model Associations
    user_model.hasMany(shop_model, {
        foreignKey: 'id_user',
        as: 'userhasmanyshops',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    user_model.hasMany(sales_model, {
        foreignKey: 'id_user',
        as: 'userhasmanysales',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    user_model.belongsToMany(product_model, { 
        through: orders_model, 
        foreignKey: 'id_user',
        as: 'productsBoughtByThisUser' 
    });

    // Shop Model Associations
    shop_model.belongsTo(user_model, {
        foreignKey: 'id_user',
        as: 'shopbelongstouser',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    shop_model.hasMany(sales_model, {
        foreignKey: 'id_shop',
        as: 'shophasmanysales',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    shop_model.hasMany(buys_model, {
        foreignKey: 'id_shop',
        as: 'shophasmanybuys',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    // Product Model Associations
    product_model.belongsToMany(user_model, { 
        through: orders_model, 
        foreignKey: 'id_product',
        as: 'usersThatBoughtThisProduct' 
    });

    product_model.hasMany(sales_model, {
        foreignKey: 'id_product',
        as: 'producthasmanysales',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    // Sales Model Associations
    sales_model.belongsTo(shop_model, { 
        foreignKey: 'id_shop', 
        as: 'salesbelongstoshop' 
    });

    sales_model.belongsTo(user_model, { 
        foreignKey: 'id_user', 
        as: 'salesbelongstouser' 
    });

    sales_model.belongsTo(product_model, { 
        foreignKey: 'id_product', 
        as: 'salesbelongstoproduct' 
    });

    // Provider and Produce Associations
    provider_model.hasMany(produce_model, {
        foreignKey: 'id_provider',
        as: 'providerhasmanyproducts',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    produce_model.belongsTo(provider_model, {
        foreignKey: 'id_provider',
        as: 'producebelongstoprovider'
    });

    produce_model.belongsTo(product_model, {
        foreignKey: 'id_product',
        as: 'producebelongstoproduct'
    });

    // Buys Model Associations
    buys_model.belongsTo(shop_model, { 
        foreignKey: 'id_shop', 
        as: 'buysbelongstoshop' 
    });

    buys_model.belongsTo(provider_model, { 
        foreignKey: 'id_provider', 
        as: 'buysbelongstoprovider' 
      });
}

export default setupAssociations;