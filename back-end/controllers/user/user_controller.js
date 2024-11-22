import user_model from "../../models/user_model.js";

// Validation utilities
const validateUserData = (userData) => {
    const errors = [];
    
    // Required fields check
    const requiredFields = ['name_user', 'pass_user'];
    requiredFields.forEach(field => {
        if (!userData[field]) {
            errors.push(`Missing required field: ${field}`);
        }
    });

    // Username validation
    if (userData.name_user) {
        if (userData.name_user.length < 3) {
            errors.push('Username must be at least 3 characters long');
        }
        if (userData.name_user.length > 50) {
            errors.push('Username must be less than 50 characters');
        }
        if (!/^[a-zA-Z0-9_]+$/.test(userData.name_user)) {
            errors.push('Username can only contain letters, numbers, and underscores');
        }
    }

    // Password validation
    if (userData.pass_user) {
        if (userData.pass_user.length !== 4) {
            errors.push('Password must be exactly 4 digits');
        }
        if (!/^\d+$/.test(userData.pass_user)) {
            errors.push('Password must contain only digits');
        }
    }

    // User type validation for registration
    if (userData.type_user) {
        const validTypes = ['client', 'seller', 'provider'];
        if (!validTypes.includes(userData.type_user)) {
            errors.push('Invalid user type. Must be client, seller, or provider');
        }
    }

    // Location validation if provided
    if (userData.location_user && typeof userData.location_user !== 'string') {
        errors.push('Location must be a string');
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
            return { data: [], message: "No users found" };
        }
        
        return { data: users };
    } catch (error) {
        console.error("Error in getAll:", error);
        return { 
            error: "Error retrieving users",
            details: error.message 
        };
    }
}

async function getById(id) {
    try {
        if (!id) {
            return { error: "User ID is required" };
        }

        const user = await user_model.findByPk(id);
        console.log("Retrieved user:", user);
        
        if (!user) {
            return { 
                error: "User not found",
                details: `No user found with ID: ${id}` 
            };
        }
        
        return { data: user };
    } catch (error) {
        console.error("Error in getById:", error);
        return { 
            error: "Error retrieving user",
            details: error.message 
        };
    }
}

async function create(userData) {
    try {
        // Validate input data
        const validation = validateUserData(userData);
        if (!validation.isValid) {
            return { 
                error: "Validation failed",
                details: validation.errors 
            };
        }

        // Check if user already exists
        const existingUser = await user_model.findOne({ 
            where: { name_user: userData.name_user } 
        });
        
        if (existingUser) {
            return { 
                error: "User already exists",
                details: "A user with this username already exists" 
            };
        }

        // Create new user
        const user = await user_model.create(userData);
        console.log("Created user:", user);
        
        return { 
            data: user,
            message: "User created successfully" 
        };
    } catch (error) {
        console.error("Error in create:", error);
        return { 
            error: "Error creating user",
            details: error.message 
        };
    }
}

async function login(userData) {
    try {
        // Validate login data
        if (!userData.name_user || !userData.pass_user) {
            return { 
                error: "Missing credentials",
                details: "Both username and password are required" 
            };
        }

        // Password validation
        if (userData.pass_user.length !== 4 || !/^\d+$/.test(userData.pass_user)) {
            return { 
                error: "Invalid password format",
                details: "Password must be exactly 4 digits" 
            };
        }

        // Find user
        const user = await user_model.findOne({ 
            where: { name_user: userData.name_user } 
        });

        if (!user) {
            return { 
                error: "Authentication failed",
                details: "User not found" 
            };
        }

        // Verify password
        if (user.pass_user !== userData.pass_user) {
            return { 
                error: "Authentication failed",
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
            error: "Login error",
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
                error: "Registration failed",
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
            message: "Registration successful" 
        };
    } catch (error) {
        console.error("Error in register:", error);
        return { 
            error: "Registration error",
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
                error: "No update data provided",
                details: "At least one field must be provided for update" 
            };
        }

        // Find user
        const user = await user_model.findByPk(id);
        if (!user) {
            return { 
                error: "Update failed",
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
                error: "Validation failed",
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
            error: "Update error",
            details: error.message 
        };
    }
}

async function removeById(id) {
    try {
        if (!id) {
            return { error: "User ID is required" };
        }

        const user = await user_model.findByPk(id);
        if (!user) {
            return { 
                error: "Deletion failed",
                details: "User not found" 
            };
        }

        await user_model.destroy({
            where: { id_user: id }
        });       

        console.log("Deleted user with id:", id);
        return { 
            data: { id },
            message: "User successfully deleted" 
        };
    } catch (error) {
        console.error("Error in removeById:", error);
        return { 
            error: "Deletion error",
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
    register 
};

export default { 
    getAll, 
    getById, 
    create, 
    update, 
    removeById, 
    login, 
    register 
};