import productController from "./product_controller.js";

async function getAll(req, res) {
    const {error, data} = await productController.getAll();
    res.json({error, data});
}

async function getById(req, res) {
    const id = req.params.id;
    const {error, data} = await productController.getById(id);
    res.json({error, data});
}

async function create(req, res) {
    //post method
    // const {id_product, name_product, price_product, discount_product, season_product } = req.body;
    //get method
    const {name_product, price_product, discount_product, season_product } = req.query;
    const {error, data} = await productController.create({name_product, pass_product, location_product});
    res.json({error, data});
}

async function update(req, res) {
     //post method
    // const {id_product, name_product, price_product, discount_product, season_product } = req.body;
    //get method
    const id = req.params.id;
    const {id_product, name_product, price_product, discount_product, season_product } = req.query;
    const {error, data} = await productController.update(id, {id_product, name_product, price_product, discount_product, season_product});
    res.json({error, data});
}

async function removeById(req, res) {
    const id = req.params.id;
    const {error, data} = await productController.removeById(id);
    res.json({error, data});
}



export {
    getAll,
    getById,
    create,
    update,
    removeById
}

export default {
    getAll,
    getById,
    create,
    update,
    removeById
}