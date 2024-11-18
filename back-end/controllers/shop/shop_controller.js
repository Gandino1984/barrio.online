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
        const shop = await shop_model.create(shopData);
        console.log("Created shop:", shop);
        return { data: shop };
    } catch (error) {
        console.error("Error in create:", error);
        return { error: error.message };
    }
}   

async function update(id, shopData) {
    try {
        const { name_shop, pass_shop, location_shop } = shopData;
        
        const shop = await shop_model.findByPk(id);
        if (!shop) {
            console.log("shop not found with id:", id);
            return { error: "shop not found" };
        }

        // Only update fields that were provided
        if (name_shop) shop.name_shop = name_shop;
        if (pass_shop) shop.pass_shop = pass_shop;
        if (location_shop) shop.location_shop = location_shop;
    
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

export { getAll, getById, create, update, removeById }

export default { getAll, getById, create, update, removeById }