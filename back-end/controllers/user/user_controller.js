import user_model from "../../models/user_model.js";

async function getAll() {
    try {
        // const users = await user_model.findAll({include: "productsBoughtByThisUser"});
        const users = await user_model.findAll();
        console.log("Retrieved users:", users);
        return { data: users };
    } catch (error) {
        console.error("!!!! user CONTROLLER: Error in getAll() -> ", error);
        return { error: error.message };
    }
}

async function getById(id) {
    try {
        const user = await user_model.findByPk(id);
        console.log("Retrieved user:", user);
        
        if (!user) {
            console.log("user not found with id:", id);
            return { error: "user not found" };
        }
        
        return { data: user };
    } catch (error) {
        console.error("Error in getById:", error);
        return { error: error.message };
    }
}

// async function create(userData) {
//     try {
//         const user = await user_model.create(userData);
//         // console.log("Created user:", user);
//         return { data: user };
//     } catch (error) {
//         // console.error("Error in create:", error);
//         return { error: error.message };
//     }
// }   
async function create(userData) {
    try {
        // Check if user already exists by name
        const existingUser = await user_model.findOne({ 
            where: { name_user: userData.name_user } 
        });
        if (existingUser) {
            return { 
                error: "User with this name already exists", 
                data: null 
            };
        }
        // If no existing user, proceed with creation
        const user = await user_model.create(userData);
        return { data: user };
    } catch (error) {
        return { error: error.message };
    }
}

async function update(id, userData) {
    try {
        const { name_user, pass_user, location_user } = userData;
        
        const user = await user_model.findByPk(id);
        if (!user) {
            console.log("user not found with id:", id);
            return { error: "user not found" };
        }

        // Only update fields that were provided
        if (name_user) user.name_user = name_user;
        if (pass_user) user.pass_user = pass_user;
        if (location_user) user.location_user = location_user;
        if (type_user) user.type_user = type_user;
    
        await user.save();
        console.log("Updated user:", user);
        return { data: user };
    } catch (error) {
        console.error("Error in update:", error);
        return { error: error.message };
    }
}

async function removeById(id) {
    try {
        const user = await user_model.findByPk(id);
        if (!user) {
            console.log("user not found with id:", id);
            return { error: "user not found" };
        }

        await user_model.destroy({
            where: { id_user: id }
        });
        
        console.log("Deleted user with id:", id);
        return { data: { message: "user successfully deleted", id } };
    } catch (error) {
        console.error("Error in removeById:", error);
        return { error: error.message };
    }
}

export { getAll, getById, create, update, removeById }

export default { getAll, getById, create, update, removeById }