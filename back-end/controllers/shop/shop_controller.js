import shop_model from "../../models/shop_model.js";
import user_model from "../../models/user_model.js";

async function getAll() {
    try {
        const shops = await shop_model.findAll();
        console.log("Retrieved shops:", shops);

        if (!shops || shops.length === 0) {
            return { error: "No hay tiendas registradas", data: [] };
        }

        return { data: shops };
    } catch (err) {
        console.error("Error in getAll():", err);
        return { error: err.message };
    }
}

async function create(shopData) {
    try {
        // Check if user already exists by name
        console.log('-> shop_controller.js - create() - Buscando shopData.name_shop en la DB = ', shopData.name_shop);

        const existingShop = await shop_model.findOne({ 
            where: { name_shop: shopData.name_shop } 
        });

        if (existingShop) {
            console.error("Ya existe una tienda con ese nombre");
            return { 
                error: "Ya existe una tienda con ese nombre", 
                data: null 
            };
        }

        // If no existing shop, proceed with creation
        const shop = await shop_model.create(shopData);
        
        return { data: shop };
    } catch (err) {
        return { error: err.message };
    }
}


async function update(id, shopData) {
    try {
        const { name_shop, location_shop, type_shop } = shopData;
        const shop = await shop_model.findByPk(id);
        if (!shop) {
            console.log("shop not found with id:", id);
            return { error: "shop not found" };
        }
        // Only update fields that were provided
        if (name_shop) shop.name_shop = name_shop;
        if (location_shop) shop.location_shop = location_shop;
        if (type_shop) shop.type_shop = type_shop;
        await shop.save();
        console.log("Updated shop:", shop);
        return { data: shop };
    } catch (err) {
        console.error("Error in update:", err);
        return { error: err.message };
    }
}

async function getByType(shopType) {
    try {
        console.log(`!!! Attempting to find shops with type: ${shopType}`);
        const shops = await shop_model.findAll({ 
            where: { type_shop: shopType }
        }); 
        console.log(`Database Query - Shops found:`, shops);
        if (shops.length === 0) {
            console.log(`No shops found with type: ${shopType}`);
            return { error: "No shops found with this type" };
        }
        console.log(`Retrieved shops with type ${shopType}:`, shops);
        return { data: shops };
    } catch (err) {
        console.error("Detailed error in getByType:", err);
        return { error: err.message };
    }
}

async function getByUserId(id) {
    try {
        console.log(`Attempting to find shops for user ID: ${id}`);
        const shops = await shop_model.findAll({ 
            where: { id_user: id },
            // include the related user details
            include: [{ model: user_model, as: 'shopbelongstouser' }]
        }); 
        console.log(`Retrieved shops for user ${id}:`, shops);
        if (shops.length === 0) {
            console.log(`No shops found for user ID: ${id}`);
            return { error: "No shops found for this user" };
        }
        return { data: shops };
    } catch (err) {
        console.error("Detailed error in getByUser:", err);
        return { error: err.message };
    }
}

async function removeById(id) {
    try {
      // Find the shop and verify it exists
      const shop = await shop_model.findOne({
        where: { id_shop: id }
      });
      if (!shop) {
        return { error: "Shop not found", status: 404 };
      }
      // Delete the shop with cascade (do I need this with cascade??????)
      await shop.destroy({ cascade: true });
      return { data: { message: "Shop successfully deleted", id: id } };
    } catch (err) {
      console.error("Error in removeById:", err);
      return { error: "An error occurred while deleting the shop", status: 500 };
    }
  }

async function getTypesOfShops() {
    try {
      const shopTypes = await shop_model.findAll({
        attributes: ['type_shop'],
        group: ['type_shop'],
      });
      return { data: shopTypes.map((type) => type.type_shop) };
    } catch (err) {
      console.error('Error fetching types of shops: ', err);
      return { error: err.message };
    }
  }

export { getAll, 
    create, 
    update, 
    removeById, 
    getByType, 
    getByUserId, 
    getTypesOfShops }

export default { getAll, 
    create, 
    update, 
    removeById, 
    getByType, 
    getByUserId, 
    getTypesOfShops }