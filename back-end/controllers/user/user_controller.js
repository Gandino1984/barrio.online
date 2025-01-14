import { console } from "inspector";
import user_model from "../../models/user_model.js";
import bcrypt from "bcrypt";
import fs from 'fs';  
import path from 'path'; 

const validateUserData = (userData) => {
    console.log("-> user_controller.js - validateUserData() - userData = ", userData);
    
    const errors = [];
    const requiredFields = ['name_user', 'type_user', 'location_user'];
    
    requiredFields.forEach(field => {
        if (!userData[field]) {
            errors.push(`Falta el campo: ${field}`);
        }
    });
    
    if (userData.name_user) {
        if (userData.name_user.length < 3) {
            errors.push('El nombre debe tener al menos 3 caracteres');
        }
        if (userData.name_user.length > 100) {
            errors.push('El nombre no puede exceder 50 characters');
        }
        if (!/^[a-zA-Z0-9_ ]+$/.test(userData.name_user)) {
            errors.push('El nombre solo puede contener letras, números, guiones bajos y espacios');
        }
    }
    if (userData.type_user) {
        const validTypes = ['user', 'seller', 'provider', 'admin'];
        if (!validTypes.includes(userData.type_user)) {
            errors.push('Tipo de usuario no valido');
        }
    }
    if (!userData.location_user) {
        errors.push(`Falta el campo: location_user`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

async function getAll() {
    try {
        const users = await user_model.findAll();

        console.log("-> user_controller.js - getAll() - Retrieved users = ", users);
        
        if (!users || users.length === 0) {
            return { error: "No hay usuarios registrados"};
        }
        
        return { data: users };
    } catch (err) {
        console.error("-> user_controller.js - getAll() = ", err);
        return { 
            error: "Error obteniendo los usuarios", 
        };
    }
}

async function getById(id) {
    try {
        if (!id) {
            return { error: "ID de usuario requerido" };
        }

        const user = await user_model.findByPk(id);
        
        console.log("-> user_controller.js - getById() - Retrieved user = ", user);

        if (!user) {
            return { error: "Usuario no encontrado" };
        }   
        return { data: user };
    } catch (err) {
        console.error("-> user_controller.js - Error in getById() = ", err);
        return { 
            error: "Error al obtener el usuario",
        };
    }
}

async function getByUserName(userName) {
    console.log("-> user_controller.js - getByUserName() - userName = ", userName);

    try{
        const user = await user_model.findOne({ 
             where: { name_user: userName } 
        });
    
        if (user) {
            //erase this log later
            console.log('->  getByUserName() - Datos completos obtenidos = ', user);
            return { 
                data: user
            };
        }else{
            console.log('->  El usuario no existe');
            return {  
                error: "El usuario no existe"
            };
        }
    }catch(err){
        console.error("-> user_controller.js - Error in getByUserName() = ", err);
        return {
            error: "Error al obtener el usuario"
        };
    }

}

async function create(userData) {
    try {
        const validation = validateUserData(userData);

        if (!validation.isValid) {
            return { 
                error: "Validación fallida"
            };
        }

        // Check if user already exists
        const existingUser = await user_model.findOne({ 
            where: { name_user: userData.name_user } 
        });

        if (existingUser) {
            return { 
                error: "El usuario ya existe"
            };
        }
        // Create new user
        const user = await user_model.create(userData);
        console.log("Created user:", user);

        return { 
            data: user,
            message: "Usuario creado" 
        };
    } catch (err) {
        console.error("Error in create:", err);
        return { 
            error: "Error al crear el usuario",
        };
    }
}

async function login(userData) {

    console.log("-> user_controller.js - login() - userData = ", userData);
    
    try {
        if (!userData.name_user || !userData.pass_user) {
            console.log('-> login() - Información de usuario incompleta');
            return {
                error: "Información de usuario incompleta",
                details: "Both username and password are required"
            }; 
        }
        if (userData.pass_user.length !== 4 || !/^\d+$/.test(userData.pass_user)) {
            return {
                error: "Contraseña inválida"
            }; 
        }

        // Find user: we need the hashed password and to retrieve the user_type
        // to add it to the currentUser login data so the app knows what
        // type of user is trying to log in
        const user = await user_model.findOne({ 
            where: { name_user: userData.name_user } 
        });

        if (!user) {
            return {
                error: "El usuario no existe"
            };
        }

        // Password comparisson: userData.pass_user is the one from the 
        // request(form/unhashed data) user.pass_user is the hashed one
        const isPasswordValid = await bcrypt.compare(userData.pass_user, user.pass_user);

        // Password check
        if (!isPasswordValid) {
            console.log('-> user_controller.js - login() - Contraseña incorrecta');
            return { 
                error: "Contraseña incorrecta"
            };
        }

        // Return user data without sensitive information
        const userResponse = {
            id_user: user.id_user,
            name_user: user.name_user,
            type_user: user.type_user,
            location_user: user.location_user
        };

        return {
            data: userResponse,
            message: "Login exitoso" 
        };

    } catch (err) {
        console.error("-> Error al iniciar sesión =", err);
        return {
            error: "Error al iniciar sesión",
            details: err.message        
        }; 
    }
}

async function register(userData) {
    try {
        const validation = validateUserData(userData);

        if (!validation.isValid) {
            console.error('-> user_controller.js - register() - Error de validación = ', validation.errors);
            return { 
                error: "Validación fallida",
                details: validation.errors 
            };
        }

        // Check if user already exists
        const existingUser = await user_model.findOne({ 
            where: { name_user: userData.name_user } 
        });

        if (existingUser) {
            console.log('-> register() - El usuario ', existingUser, ' ya existe');
            return { 
                error: "El usuario ya existe",
            };
        }

        const user = await user_model.create(userData);

        // Return user data without sensitive information
        const userResponse = {
            id_user: user.id_user,
            name_user: user.name_user,
            type_user: user.type_user,
            location_user: user.location_user
        };

        return { 
            data: userResponse,
            message: "Registro exitoso" 
        };
    } catch (err) {
        console.error("Error en el registro = ", err);
        return { 
            error: "Error de registro",
            details: err.message 
        };
    }
}

async function update(id, userData) {
    try {
        if (!id) {
            return { error: "El ID de usuario es requerido" };
        }

        // Check if userData is empty
        if (Object.keys(userData).length === 0) {
            return { 
                error: "No hay campos para actualizar",
                details: "At least one field must be provided for update" 
            };
        }

        // Find user
        const user = await user_model.findByPk(id);
        if (!user) {
            return { 
                error: "El usuario no existe",
                details: "User not found" 
            };
        }

        // Validate the fields that are being updated
        const fieldsToUpdate = {};
        if (userData.name_user) fieldsToUpdate.name_user = userData.name_user;
        if (userData.pass_user) fieldsToUpdate.pass_user = userData.pass_user;
        if (userData.location_user) fieldsToUpdate.location_user = userData.location_user;
        if (userData.type_user) fieldsToUpdate.type_user = userData.type_user;

        const validation = validateUserData(fieldsToUpdate);
        if (!validation.isValid) {
            return { 
                error: "La validación fallo",
                details: validation.errors 
            };
        }

        // Update user
        Object.assign(user, fieldsToUpdate);
        await user.save();

        console.log("Updated user:", user);
        return { 
            data: user,
            message: "Usuario actualizado correctamente" 
        };
    } catch (error) {
        console.error("Error in update:", error);
        return { 
            error: "Error de actualización"
        };
    }
}

async function removeById(id_user) {
    try {
        if (!id_user) {
            return { error: "El ID de usuario es requerido" };
        }

        const user = await user_model.findByPk(id_user);
        
        if (!user) {
            return { 
                error: "Usuario no encontrado",
                details: "Usuario no encontrado" 
            };
        }

        await user.destroy();       
        
        return { 
            data: id_user,
            message: "El usuario se ha borrado correctamente" 
        };

    } catch (err) {
        console.error("-> user_controller.js - removeById() - Error = ", err);
        return { 
            error: "Error al borrar el usuario",
            details: err.message 
        };
    }
}

async function updateProfileImage(userName, imagePath) {
    try {
        const user = await user_model.findOne({
            where: { name_user: userName }
        });
        
        if (!user) {
            return {
                error: "Usuario no encontrado"
            };
        }

        // Make sure this matches your actual file structure
        const relativePath = path.join('users', userName, path.basename(imagePath));
        console.log('Saving path to database:', relativePath);

        await user.update({ image_user: relativePath });

        return {
            data: { image_user: relativePath },
            message: "Imagen de perfil actualizada correctamente"
        };
    } catch (err) {
        console.error("Error updating profile image:", err);
        return {
            error: "Error al actualizar la imagen de perfil",
            details: err.message
        };
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
    updateProfileImage 
};

export default { 
    getAll, 
    getById, 
    create, 
    update, 
    removeById, 
    login, 
    register,
    getByUserName,
    updateProfileImage 
};