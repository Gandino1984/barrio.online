import shopController from "./shop_controller.js";

async function getAll(req, res) {
  try{
    const {error, data} = await shopController.getAll();
    res.json({error, data});
  }  
  catch (err) {
    console.error("-> shop_api_controller.js - getAll() - Error =", err);
    res.status(500).json({ 
      error: "Error al obtener todas las tiendas", 
      data: data
    });
  }
}

async function getTypesOfShops(req, res) {
  try{
    const {error, data} = await shopController.getTypesOfShops();
    res.json({error, data});
  }catch (err) {
    console.error("-> shop_api_controller.js - getTypesOfShops() - Error =", err);
    res.status(500).json({ 
      error: "Error al obtener todos los tipos de tiendas",
      data: data
    });
  }    
}

async function getByType(req, res) {
  try {
    const { type_shop } = req.body;

    if (!type_shop) {
        console.error('-> shop_api_controller.js - getByType() - Error = El parámetro type_shop es obligatorio');
        res.status(400).json({ 
            error: 'El parámetro type_shop es obligatorio', 
        });
    }
  
    const {error, data} = await shopController.getByType(type_shop);

    res.json({error, data});
  }catch (err) {
    console.error("-> shop_api_controller.js - getByType() - Error =", err);
    res.status(500).json({ 
      error: "Error al obtener las tiendas por tipo" 
    });
  }
}

async function getById(req, res) {
    const { id_shop } = req.body;
    const {error, data} = await shopController.getById(id_shop);
    res.json({error, data});
}

async function create(req, res) {
  try {
    const { name_shop, location_shop, type_shop, subtype_shop, calification_shop, image_shop, id_user } = req.body;

    if(name_shop === undefined || location_shop === undefined || type_shop === undefined || subtype_shop === undefined  || calification_shop === undefined || id_user === undefined || image_shop === undefined){
      console.error('-> shop_api_controller.js - create() - Error = Todos los campos son obligatorios');
      console.log(req.body);
      res.status(400).json({
            error: 'Todos los campos son obligatorios',
        });
    }
    
    const {error, data, success} = await shopController.create({name_shop, location_shop, type_shop, subtype_shop, id_user, calification_shop, image_shop});
    
    res.json({error, data, success});
  } catch (err) {
    console.error("-> shop_api_controller.js - create() - Error =", err);
    res.status(500).json({ 
      error: "Error al crear la tienda",
      details: err.message 
    });
    
  }
}

async function update(req, res) {
    const {id_shop} = req.body;

    const {error, data} = await shopController.update(id_shop, { name_shop, location_shop, type_shop, subtype_shop, id_user, calification_shop, image_shop});
    
    res.json({error, data});
}

async function removeById(req, res) {
    try {
      const  id_shop  = req.params.id_shop;

      if (!id_shop) {
        res.status(400).json({ 
          error: 'El ID de la tienda es obligatorio', 
        });
      }
      
      const {error, data} = await shopController.removeById(id_shop);
      
      res.json({ data, error });
    } catch (err) {
      console.error("-> shop_api_controller.js - removeById() - Error =", err);
      res.status(500).json({ 
        error: "Error al eliminar la tienda",
        details: err.message 
      });
    }
  }

const getByUserId = async (req, res) => {
    try {
        const { id_user } = req.body;
        
        if (!id_user) {
            console.error('-> shop_api_controller.js - getByUserId() - Error = User ID is required');
            res.status(400).json({
                error: 'El ID de usuario es obligatorio',
                success: false
            });
        }

        const {error, data} = await shopController.getByUserId(id_user);
        
   
        res.json({error, data});
    } catch (err) {
        console.error('-> Error al obtener las tiendas del usuario = ', err);
        res.status(500).json({
            error: 'Error al obtener las tiendas del usuario',
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