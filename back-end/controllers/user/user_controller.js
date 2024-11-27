import user_model from "../../models/user_model.js";
import { Op } from "sequelize";

// Validation utilities
const validateUserData = (userData) => {
    const errors = [];
    // Required fields check
    const requiredFields = ['name_user', 'pass_user'];
    requiredFields.forEach(field => {
        if (!userData[field]) {
            errors.push(`Falta el campo: ${field}`);
        }
    });
    // Username validation
    if (userData.name_user) {
        if (userData.name_user.length < 3) {
            errors.push('El nombre debe tener al menos 3 caracteres');
        }
        if (userData.name_user.length > 50) {
            errors.push('El nombre no puede exceder 50 characters');
        }
        if (!/^[a-zA-Z0-9_]+$/.test(userData.name_user)) {
            errors.push('El nombre solo puede contener letras, números y guiones bajos');
        }
    }
    // Password validation
    if (userData.pass_user) {
        if (userData.pass_user.length !== 4) {
            errors.push('La contraseña debe tener 4 digitos');º
        }
        if (!/^\d+$/.test(userData.pass_user)) {
            errors.push('La contraseña solo puede contener numeros');
        }
    }
    // User type validation for registration
    if (userData.type_user) {
        const validTypes = ['client', 'seller', 'provider'];
        if (!validTypes.includes(userData.type_user)) {
            errors.push('Tipo de usuario no valido');
        }
    }
    // Location validation if provided
    if (userData.location_user && typeof userData.location_user !== 'string') {
        errors.push('la ubicacion debe ser una cadena de texto');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};

async function getAll() {
    try {
        const users = await user_model.findAll();
        console.log("Retrieved users:", users);
        
        if (!users || users.length === 0) {
            return { data: [], message: "Ningún usuario encontrado" };
        }
        
        return { data: users };
    } catch (error) {
        console.error("Error in getAll:", error);
        return { 
            error: "Error obteniendo los usuarios",
            details: error.message 
        };
    }
}

async function getById(id) {
    try {
        if (!id) {
            return { error: "ID de usuario requerido" };
        }
        const user = await user_model.findByPk(id);
        console.log("Retrieved user:", user);
        if (!user) {
            return { 
                error: "Usuario no encontrado",
                details: `No user found with ID: ${id}` 
            };
        }   
        return { data: user };
    } catch (error) {
        console.error("Error in getById:", error);
        return { 
            error: "Error al obtener el usuario",
            details: error.message 
        };
    }
}

async function getByUserName(userName) {
    console.log("user_controller - getByUserName - userName = ", userName);
    
     const user = await user_model.findOne({ 
         where: { name_user: userName } 
    });
    
    if (user) {
        return { 
            data: user
        };
    }else{
        return { 
            error: "El usuario no existe"
        };
    }
}


async function create(userData) {
    try {
        // Validate input data
        const validation = validateUserData(userData);
        if (!validation.isValid) {
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
            return { 
                error: "El usuario ya existe",
                details: "A user with this username already exists" 
            };
        }
        // Create new user
        const user = await user_model.create(userData);
        console.log("Created user:", user);
        return { 
            data: user,
            message: "Usuario creado" 
        };
    } catch (error) {
        console.error("Error in create:", error);
        return { 
            error: "Error al crear el usuario",
            details: error.message 
        };
    }
}

async function login(userData) {
    try {
        // Validate login data
        if (!userData.name_user || !userData.pass_user) {
            return { 
                error: "Información de usuario incompleta",
                details: "Both username and password are required" 
            };
        }
        // Password validation
        if (userData.pass_user.length !== 4 || !/^\d+$/.test(userData.pass_user)) {
            return { 
                error: "Contraseña inválida",
                details: "Password must be exactly 4 digits" 
            };
        }
        // Find user
        const user = await user_model.findOne({ 
            where: { name_user: userData.name_user } 
        });
        if (!user) {
            return { 
                error: "El usuario no existe",
                details: "User not found" 
            };
        }
        // Verify password
        if (user.pass_user !== userData.pass_user) {
            return { 
                error: "Contraseña incorrecta",
                details: "Incorrect password" 
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
            message: "Login successful" 
        };
    } catch (error) {
        console.error("Error in login:", error);
        return { 
            error: "Error al iniciar sesión",
            details: error.message 
        };
    }
}

async function register(userData) {
    try {
        // Validate registration data
        const validation = validateUserData({
            ...userData,
            type_user: userData.type_user || 'cliente' // Default to client if not specified
        });

        if (!validation.isValid) {
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
            return { 
                error: "El usuario ya existe",
                details: "Username already exists" 
            };
        }

        // Create user
        const user = await user_model.create({
            ...userData,
            location_user: userData.location_user || 'Bilbao'
        });

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
    } catch (error) {
        console.error("Error in register:", error);
        return { 
            error: "Error de registro",
            details: error.message 
        };
    }
}

async function update(id, userData) {
    try {
        if (!id) {
            return { error: "User ID is required" };
        }

        // Validate update data
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
            error: "Error de actualización",
            details: error.message 
        };
    }
}

async function removeById(id) {
    try {
        if (!id) {
            return { error: "El ID de usuario es requerido" };
        }

        const user = await user_model.findByPk(id);
        if (!user) {
            return { 
                error: "Borrado fallido",
                details: "User not found" 
            };
        }

        await user_model.destroy({
            where: { id_user: id }
        });       

        console.log("Deleted user with id:", id);
        return { 
            data: { id },
            message: "El usuario se ha borrado correctamente" 
        };
    } catch (error) {
        console.error("Error in removeById:", error);
        return { 
            error: "Error de borrado",
            details: error.message 
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
    getByUserName 
};

export default { 
    getAll, 
    getById, 
    create, 
    update, 
    removeById, 
    login, 
    register,
    getByUserName 
};