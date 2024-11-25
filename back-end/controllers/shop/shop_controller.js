import shop_model from "../../models/shop_model.js";

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

async function getById(id) {
    try {
        const shop = await shop_model.findByPk(id);
        console.log("Retrieved shop:", shop);
        
        if (!shop) {
            console.log("shop not found with id:", id);
            return { error: "shop not found" };
        }
        
        return { data: shop };
    } catch (error) {
        console.error("Error in getById:", error);
        return { error: error.message };
    }
}


async function create(shopData) {
    try {
        // Check if user already exists by name
        const existingShop = await shop_model.findOne({ 
            where: { name_shop: shopData.name_shop } 
        });
        if (existingShop) {
            return { 
                error: "Shop with this name already exists", 
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

async function removeById(id) {
    try {
        const shop = await shop_model.findByPk(id);
        if (!shop) {
            console.log("shop not found with id:", id);
            return { error: "shop not found" };
        }
        await shop_model.destroy({
            where: { id_shop: id }
        });
        console.log("Deleted shop with id:", id);
        return { data: { message: "shop successfully deleted", id } };
    } catch (error) {
        console.error("Error in removeById:", error);
        return { error: error.message };
    }
}

async function getByType(shopType) {
    try {
        const shops = await shop_model.findAll({ 
            where: { type_shop: shopType } 
        });
        if (shops.length === 0) {
            console.log(`No shops found with type: ${shopType}`);
            return { error: "No shops found with this type" };
        }
        
        console.log(`Retrieved shops with type ${shopType}:`, shops);
        return { data: shops };
    } catch (error) {
        console.error("Error en getByType:", error);
        return { error: error.message };
    }
}

export { getAll, getById, create, update, removeById, getByType }

export default { getAll, getById, create, update, removeById, getByType }