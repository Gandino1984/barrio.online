import userController from "./user_controller.js";
import bcrypt from 'bcrypt';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

async function getAll(req, res) {
    const {error, data} = await userController.getAll();
    res.json({error, data});
}

async function create(req, res) {
    const {name_user, pass_user, location_user, type_user, image_user } = req.body;
    const {error, data} = await userController.create({name_user, pass_user, location_user, type_user, image_user});
    res.json({error, data});
}

async function getById(req, res) {
    const id = req.body.id_user;
    const {error, data} = await userController.getById(id);
    res.json({error, data});
}

async function getByUserName(req, res) {
    const name = req.body.name_user;
    const {error, data} = await userController.getByUserName(name);
    res.json({error, data});
}

async function login(req, res) {
    const { name_user, pass_user} = req.body;
    try {
        if(!name_user || !pass_user){
            res.status(400).json({ 
                error: 'Los parámetros name_user, pass_user son obligatorios', 
                requestBody: req.body 
            });
        }
        
        const {error, data} = await userController.login({ name_user, pass_user});

        res.json({error, data});
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
 
}

async function register(req, res) {
    let {name_user, pass_user, location_user, type_user, image_user } = req.body;
    try{
        if(!name_user || !pass_user || !location_user || !type_user){
            res.status(400).json({ 
                error: 'Los parámetros name_user, pass_user, location_user y type_user son obligatorios', 
                requestBody: req.body 
            });
        }

        const hashedPassword = await bcrypt.hash(pass_user, 5);

        pass_user = hashedPassword;

        const {error, data} = await userController.register({name_user, pass_user, location_user, type_user, image_user});

        res.json({error, data});
    }catch(err){
        console.error('-> user_api_controller.js - register() - Error = ', err);
        res.status(500).json({ error: 'Error en el registro de usuario' });
    }
}

async function update(req, res) {
    const {id_user, name_user, pass_user, location_user, type_user, image_user } = req.body;
    
    const {error, data} = await userController.update(id_user, { name_user, pass_user, location_user, type_user, image_user });
    
    res.json({error, data});
}

async function removeById(req, res) {
    try {
        const id_user = req.params.id_user;

        if (!id_user) {
            res.status(400).json({ error: 'El ID del usuario es obligatorio' });
        }

        const { error, data } = await userController.removeById(id_user);

        res.json({ error, data });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el usuario', details: err.message });
    }
}

async function uploadProfileImage(req, res) {
    try {
        if (!req.file) {
            console.error('-> user_api_controller.js - uploadProfileImage() - No se ha proporcionado ninguna imagen');
            return res.status(400).json({ error: 'No se ha proporcionado ninguna imagen' });
        }

        const userId = req.body.userId;
        const imageBuffer = req.file.buffer;

        const result = await userController.saveProfileImage(userId, imageBuffer);
        
        if (result.error) {
            return res.status(400).json(result);
        }
        
        return res.json(result);
    } catch (err) {
        console.error('Error in uploadProfileImage:', err);
        return res.status(500).json({ 
            error: 'Error al procesar la imagen'
        });
    }
}

export {
    getAll,
    getById,
    create,
    update,
    removeById,
    login,
    register,
    getByUserName,
    uploadProfileImage
}

export default {
    getAll,
    getById,
    create,
    update,
    removeById,
    login,
    register,
    getByUserName,
    uploadProfileImage
}