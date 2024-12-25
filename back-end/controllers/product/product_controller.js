import product_model from "../../models/product_model.js";
import { Op } from "sequelize";

async function getAll() {
    try {
        const products = await product_model.findAll();

        if (!products || products.length === 0) {
            return { error: "No hay productos registrados", data: [] };
        }
        
        return { data: products,
             success: "Productos encontrados"
        };
    } catch (err) {
        console.error("-> product_controller.js - getAll() -Error =", err);
        return { error: err.message };
    }
}

async function create(productData) {
    try {
        const product = await product_model.create(productData);
        
        return { data: product,
            success: "Producto creado"
         };
    } catch (err) {
        console.error("-> product_controller.js - create() - Error = ", err);
        return { error: err.message };
    }
}

async function getById(id) {
    try {
        const product = await product_model.findByPk(id);
        
        if (!product) {
            console.error("-> product_controller.js - getById() - producto no encontrado = ", id);
            return { error: "Producto no encontrado" };
        }
        
        return  {data: product, 
            success: "Producto encontrado"
        };
    } catch (err) {
        console.error("-> product_controller.js - getById() - Error = ", err);
        return { error: err.message };
    }
}

async function update(id, productData) {
    try {
        const { name_product, price_product, discount_product, season_product, calification_product, type_product, stock_product, info_product, id_shop} = productData;

        const product = await product_model.findByPk(id);
        if (!product) {
            console.log("-> product_controller.js - update() - Producto no encontrado con id:", id);
            return { error: "Producto no encontrado" };
        }
        // Only update fields that were provided
        if (name_product) product.name_product = name_product;
        if (price_product) product.price_product = price_product;
        if (discount_product) product.discount_product = discount_product;
        if (season_product) product.season_product = season_product;
        if (calification_product) product.calification_product = calification_product;
        if (type_product) product.type_product = type_product;
        if (stock_product) product.stock_product = stock_product;
        if (info_product) product.info_product = info_product;
        if (id_shop) product.id_shop = id_shop;
        
        await product.save();

        return { data: product,
            success: "Producto actualizado"
        };
    } catch (err) {
        console.error("-> product_controller.js - update() - Error =", err);
        return { error: err.message };
    }
}

async function removeById(id_product) {
    try {
        const product = await product_model.findByPk(id_product);

        if (!product) {
            console.log("Producto no encontrado con id = ", id_product);
            return { error: "Producto no encontrado" };
        }

        await product.destroy();

        return { 
            data:  id_product,
            success: "Producto eliminado"
            };
    } catch (err) {
        console.error("-> product_controller.js - removeById() - Error = ", err);
        return { error: err.message };
    }
}

async function getByShopId(id_shop) {
    try {
        const products = await product_model.findAll({
            where: { id_shop: id_shop }
        });

        console.log("-> product_controller.js - getByShopId() - products de tienda = ", id_shop, products);
        
        return { data: products,
            success: "Productos encontrados"
         };
    } catch (err) {
        console.error("-> product_controller.js - getByShopId() - Error = ", err);
        return { error: err.message };
    }
}

async function getByType(type_product) {
    try {
        const productTypes = await product_model.findAll({
            attributes: [type_product],
            group: [type_product],
        });
        return { data: productTypes.map((type) => type[type_product]),
            success: "Productos por tipo encontrados"
         };
    } catch (err) {
        console.error("-> product_controller.js - getByType() - Error = ", err);
        return { error: err.message };
    }
}

async function getOnSale() {
    try {
        const products = await product_model.findAll({
            // discount_product
            where: { discount_product: {[Op.gt]:0} }
        });

        if (!products || products.length === 0) {
            return { message: "No hay productos en oferta", data: products };
        }

        console.log("-> product_controller.js - getOnSale() - products = ", products);
        
        return { data: products,
            success: "Productos en oferta encontrados"
         };
    } catch (err) {
        console.error("-> product_controller.js - getOnSale() - Error = ", err);
        return { error: err.message };
    }
}

export { getAll, getById, create, update, removeById, getByShopId, getByType, getOnSale}

export default { getAll, getById, create, update, removeById, getByShopId, getByType, getOnSale }