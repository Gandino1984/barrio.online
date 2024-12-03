import shop_model from "../../models/shop_model.js";
import user_model from "../../models/user_model.js";

/**
 * Retrieves all shops from the database.
 * 
 * @async
 * @returns {Object} An object containing the retrieved shops or an error message.
 */
async function getAll() {
    try {
        const shops = await shop_model.findAll();
        console.log("Retrieved shops:", shops);
        return { data: shops };
    } catch (error) {
        console.error("Error in getAll:", error);
        return { error: error.message };
    }
}

/**
 * Creates a new shop in the database.
 * 
 * @async
 * @param {Object} shopData - The data for the new shop.
 * @param {string} shopData.name_shop - The name of the shop.
 * @param {string} shopData.location_shop - The location of the shop.
 * @param {string} shopData.type_shop - The type of the shop.
 * @returns {Object} An object containing the created shop or an error message.
 */
async function create(shopData) {
    try {
        // Check if user already exists by name
        const existingShop = await shop_model.findOne({ 
            where: { name_shop: shopData.name_shop } 
        });
        if (existingShop) {
            return { 
                error: "Ya existe una tienda con ese nombre", 
                data: null 
            };
        }
        // If no existing shop, proceed with creation
        const shop = await shop_model.create(shopData);
        return { data: shop };
    } catch (error) {
        return { error: error.message };
    }
}

/**
 * Updates an existing shop in the database.
 * 
 * @async
 * @param {number} id - The ID of the shop to update.
 * @param {Object} shopData - The updated data for the shop.
 * @param {string} shopData.name_shop - The updated name of the shop.
 * @param {string} shopData.location_shop - The updated location of the shop.
 * @param {string} shopData.type_shop - The updated type of the shop.
 * @returns {Object} An object containing the updated shop or an error message.
 */
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
    } catch (error) {
        console.error("Error in update:", error);
        return { error: error.message };
    }
}

/**
 * Retrieves shops by type from the database.
 * 
 * @async
 * @param {string} shopType - The type of shops to retrieve.
 * @returns {Object} An object containing the retrieved shops or an error message.
 */
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
    } catch (error) {
        console.error("Detailed error in getByType:", error);
        return { error: error.message };
    }
}

/**
 * Retrieves shops by user ID from the database.
 * 
 * @async
 * @param {number} id - The ID of the user.
 * @returns {Object} An object containing the retrieved shops or an error message.
 */
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
    } catch (error) {
        console.error("Detailed error in getByUser:", error);
        return { error: error.message };
    }
}

/**
 * Deletes a shop by ID from the database.
 * 
 * @async
 * @param {number} id - The ID of the shop to delete.
 * @returns {Object} An object containing a success message or an error message.
 */
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
    } catch (error) {
      console.error("Error in removeById:", error);
      return { error: "An error occurred while deleting the shop", status: 500 };
    }
  }

  /**
 * Retrieves unique shop types from the database.
 * 
 * @async
 * @returns {Object} An object containing the unique shop types or an error message.
 */
async function getUniqueShopTypes() {
    try {
      const shopTypes = await shop_model.findAll({
        attributes: ['type_shop'],
        group: ['type_shop'],
      });
      return { data: shopTypes.map((type) => type.type_shop) };
    } catch (error) {
      console.error('Error fetching unique shop types:', error);
      return { error: error.message };
    }
  }



export { getAll, create, update, removeById, getByType, getByUserId, getUniqueShopTypes }

export default { getAll, create, update, removeById, getByType, getByUserId, getUniqueShopTypes }