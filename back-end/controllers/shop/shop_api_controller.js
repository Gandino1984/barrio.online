import shopController from "./shop_controller.js";

async function getAll(req, res) {
    const {error, data} = await shopController.getAll();
    res.json({error, data});
}

async function getById(req, res) {
    const { id_shop } = req.body;
    const {error, data} = await shopController.getById(id_shop);
    res.json({error, data});
}

async function getByType(req, res) {
  
    const { type_shop } = req.body;
  
    if (!type_shop) {
        console.error('-> shop_api_controller.js - getByType() - Error = El parámetro type_shop es obligatorio');
        return res.status(400).json({ 
            error: 'El parámetro type_shop es obligatorio', 
            requestBody: req.body 
        });
    }
  
    const {error, data} = await shopController.getByType(type_shop);

    res.json({error, data});
}

async function getTypesOfShops(req, res) {
  const {error, data} = await shopController.getTypesOfShops();
  res.json({error, data});
}

async function create(req, res) {
    const { name_shop, location_shop, type_shop, subtype_shop, id_user, calification_shop, image_shop } = req.body;
    
    const {error, data} = await shopController.create({name_shop, location_shop, type_shop, subtype_shop, id_user, calification_shop, image_shop});
    
    res.json({error, data});
}

async function update(req, res) {
    const {id_shop} = req.body;

    const {error, data} = await shopController.update(id_shop, { name_shop, location_shop, type_shop, subtype_shop, id_user, calification_shop, image_shop});
    
    res.json({error, data});
}

async function removeById(req, res) {
    try {
      const { id_shop } = req.body;

      if (!id_shop) {
        console.error('-> shop_api_controller.js - removeById() - Error = Shop ID is required');
        return res.status(400).json({ 
          error: 'Shop ID is required', 
          success: false 
        });
      }
      
      const {error, data, status} = await shopController.removeById(id_shop);
      
      if (error) {
        console.error("Error deleting shop:", error);

        return res.status(status || 400).json({ 
          error, 
          success: false 
        });
      }
      
      res.json({ data, success: true });

    } catch (err) {
      console.error("-> shop_api_controller.js - removeById() - Error =", err);
      return res.status(500).json({ 
        error: "An error occurred while deleting the shop", 
        success: false 
      });
    }
  }

const getByUserId = async (req, res) => {
    try {
        const { id_user } = req.body;
        
        if (!id_user) {
            console.error('-> shop_api_controller.js - getByUserId() - Error = User ID is required');
            return res.status(400).json({
                error: 'El ID de usuario es obligatorio',
                success: false
            });
        }

        const {error, data} = await shopController.getByUserId(id_user);
        
        // Add handling for when an error is returned from the controller
        if (error) {
          console.error('Error al obtener las tiendas del usuario = ', error);
            return res.status(404).json({
                error: error,
                success: false
            });
        }
        
        res.json({error, data, success: true});
    } catch (err) {
        console.error('-> Error al obtener las tiendas del usuario = ', err);
        return res.status(500).json({
            error: 'Internal server error',
            success: false
        });
    }
};

export {
    getAll,
    getById,
    create,
    update,
    removeById,
    getByType,
    getByUserId,
    getTypesOfShops
}

export default {
    getAll,
    getById,
    create,
    update,
    removeById,
    getByType,
    getByUserId,
    getTypesOfShops 
}