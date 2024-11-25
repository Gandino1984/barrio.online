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
    console.log('Full Request Object:', req);
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    console.log('Request Query:', req.query);
    // Add explicit destructuring and logging
    const { type_shop } = req.body;
    console.log('Destructured type_shop:', type_shop);
    if (!type_shop) {
        return res.status(400).json({ 
            error: 'type_shop parameter is missing', 
            requestBody: req.body 
        });
    }
    const {error, data} = await shopController.getByType(type_shop);
    console.log('Shop Type Response - Error:', error);
    console.log('Shop Type Response - Data:', data);
    
    res.json({error, data});
}

async function create(req, res) {
    const { name_shop, pass_shop, location_shop } = req.query;
    const {error, data} = await shopController.create({name_shop, pass_shop, location_shop});
    res.json({error, data});
}

async function update(req, res) {
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