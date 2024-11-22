import userController from "./user_controller.js";

async function getAll(req, res) {
    const {error, data} = await userController.getAll();
    res.json({error, data});
}

async function getById(req, res) {
    const id = req.params.id;
    const {error, data} = await userController.getById(id);
    res.json({error, data});
}

async function login(req, res) {
    const { name_user, pass_user } = req.body;
    const {error, data} = await userController.login({ name_user, pass_user });
    res.json({error, data});
}

async function create(req, res) {
    const {name_user, pass_user, location_user, type_user } = req.body;
    const {error, data} = await userController.create({name_user, pass_user, location_user, type_user});
    res.json({error, data});
}

async function register(req, res) {
    const {name_user, pass_user, location_user, type_user } = req.body;
    const {error, data} = await userController.register({name_user, pass_user, location_user, type_user});
    res.json({error, data});
}

async function update(req, res) {
     //post method
    // const {id_user, name_user, pass_user, location_user } = req.body;
    //get method
    const id = req.params.id;
    const {id_user, name_user, pass_user, location_user, type_user } = req.query;
    const {error, data} = await userController.update(id, {id_user, name_user, pass_user, location_user, type_user});
    res.json({error, data});
}

async function removeById(req, res) {
    const id = req.body.id;
    const {error, data} = await userController.removeById(id);
    res.json({error, data});
}


export {
    getAll,
    getById,
    create,
    update,
    removeById,
    login,
    register
}

export default {
    getAll,
    getById,
    create,
    update,
    removeById,
    login,
    register
}