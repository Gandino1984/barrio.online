import shopController from "./shop_controller.js";

async function getAll(req, res) {
    const {error, data} = await shopController.getAll();
    res.json({error, data});
}

async function getById(req, res) {
    const id = req.params.id;
    const {error, data} = await shopController.getById(id);
    res.json({error, data});
}

async function getByType(req, res) {
    const type = req.body.type_shop;
    const {error, data} = await shopController.getByType(type);
    res.json({error, data});
}

async function create(req, res) {
    //post method
    // const {id_client, name_client, pass_client, location_client } = req.body;
    //get method
    const { name_shop, pass_shop, location_shop } = req.query;
    const {error, data} = await shopController.create({name_shop, pass_shop, location_shop});
    res.json({error, data});
}

async function update(req, res) {
     //post method
    // const {id_client, name_client, pass_client, location_client } = req.body;
    //get method
    const id = req.params.id;
    const {id_shop, name_shop, pass_shop, location_shop } = req.query;
    const {error, data} = await shopController.update(id, {id_shop, name_shop, pass_shop, location_shop});
    res.json({error, data});
}

async function removeById(req, res) {
    const id = req.params.id;
    const {error, data} = await shopController.removeById(id);
    res.json({error, data});
}

export {
    getAll,
    getById,
    create,
    update,
    removeById,
    getByType
}

export default {
    getAll,
    getById,
    create,
    update,
    removeById,
    getByType
    
}