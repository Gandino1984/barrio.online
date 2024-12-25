import productController from "./product_controller.js";

async function getAll(req, res) {
    try {
        const {error, data} = await productController.getAll();
        res.json({error, data});
    } catch (err) {
        console.error("-> product_api_controller.js - getAll() - Error =", err);
        return res.status(500).json({ 
            error: "Error al obtener todos los productos", 
            data: data
        });
    }
}

async function create(req, res) {
    try {
        const {name_product, price_product, discount_product, season_product, calification_product, type_product, stock_product, info_product, id_shop } = req.body;

        if(!name_product || !price_product || !discount_product || !season_product || !calification_product || !type_product || !stock_product || !info_product || !id_shop) {
            return res.status(400).json({
                error: "Todos los campos son obligatorios"
            });
        }

        if(price_product < 0 || discount_product < 0 || calification_product < 0 || stock_product < 0) {
            return res.status(400).json({
                error: "Los campos numéricos no pueden ser negativos"
            });
        }

        const {error, data} = await productController.create({name_product, price_product, discount_product, season_product, calification_product, type_product, stock_product, info_product, id_shop});
        
        res.json({error, data});    
    } catch (err) {
        console.error("-> product_api_controller.js - create() - Error =", err);
        return res.status(500).json({ 
            error: "Error al crear un producto", 
            data: data
        });
    }
}

async function update(req, res) {
    try {
        const {id_product, name_product, price_product, discount_product, season_product, calification_product, type_product, stock_product, info_product, id_shop  } = req.body;

        if(!id_product || !name_product || !price_product || !discount_product || !season_product || !calification_product || !type_product || !stock_product || !info_product || !id_shop) {
            return res.status(400).json({
                error: "Todos los campos son obligatorios"
            });
        }
        
        const {error, data} = await productController.update(id_product, {name_product, price_product, discount_product, season_product, calification_product, type_product, stock_product, info_product, id_shop});   

        res.json({error, data}); 
    } catch (err) {
        console.error("-> product_api_controller.js - update() - Error =", err);
        return res.status(500).json({ 
            error: "Error al actualizar un producto", 
            data: data
        });
    }

    res.json({error, data});
}

async function getById(req, res) {
    try {
        const id_product = req.body.id_product;

        if (!id_product) {  
            console.error('-> product_api_controller.js - getById() - Error = El parámetro id_product es obligatorio');
            return res.status(400).json({ 
                error: 'El parámetro id_product es obligatorio', 
            });
        }

        const {error, data} = await productController.getById(id_product);
        
        res.json({error, data});
    } catch (err) {
        console.error("-> product_api_controller.js - getById() - Error =", err);
        return res.status(500).json({ 
            error: "Error al obtener un producto", 
            data: data
        });
    }
}

async function removeById(req, res) {
    try {
        const id_product = req.params.id_product;
        
        if (!id_product) {  
            console.error('-> product_api_controller.js - removeById() - Error = El parámetro id_product es obligatorio');
            return res.status(400).json({ 
                error: 'El parámetro id_product es obligatorio', 
            });
        }

        const {error, data} = await productController.removeById(id_product);
        
        res.json({error, data});    
    } catch (err) {
        console.error("-> product_api_controller.js - removeById() - Error =", err);
        return res.status(500).json({ 
            error: "Error al eliminar un producto", 
            data: data
        });
    }
}

async function getByShopId(req, res) {
    try {
        const { id_shop } = req.body;

        if (!id_shop) {
            console.error('-> product_api_controller.js - getByShopId() - Error = El id de la tienda es obligatorio');
            return res.status(400).json({ 
                error: 'El parámetro id_shop es obligatorio', 
            });
        }

        const {error, data} = await productController.getByShopId(id_shop);

        res.json({error, data});    
    } catch (err) {
        console.error("-> product_api_controller.js - getByShopId() - Error =", err);
        return res.status(500).json({ 
            error: "Error al obtener los productos de la tienda", 
            data: data
        });
    }
}

async function getByType(req, res) {
    const type_product = req.body.type_product;
    
    if (!type_product) {
        return res.status(400).json({
            error: "El tipo de producto es obligatorio"
        });
    }
    
    const {error, data} = await productController.getByType(type_product);
    res.json({error, data});
}

async function getOnSale(req, res) {
    try {
        const discount_product = req.body.discount_product;

        if (!discount_product) {
            console.error('-> product_api_controller.js - getOnSale() - Error = El parámetro discount_product es obligatorio');
            return res.status(400).json({ 
                error: 'El parámetro discount_product es obligatorio', 
            });
        }

        const {error, data} = await productController.getOnSale();
        
        res.json({error, data});    
    } catch (err) {
        console.error("-> product_api_controller.js - getOnSale() - Error =", err);
        return res.status(500).json({ 
            error: "Error al obtener los productos en oferta", 
            data: data
        });
    }
}

export {
    getAll,
    getById,
    create,
    update,
    removeById,
    getByShopId,
    getByType,
    getOnSale
}

export default {
    getAll,
    getById,
    create,
    update,
    removeById,
    getByShopId,
    getByType,
    getOnSale
}