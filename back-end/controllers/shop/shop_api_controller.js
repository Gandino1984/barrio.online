import shopController from "./shop_controller.js";
import productController from "../product/product_controller.js";

async function getAll(req, res) {
  try{
    const {error, data} = await shopController.getAll();
    res.json({error, data});
  }  
  catch (err) {
    console.error("-> shop_api_controller.js - getAll() - Error =", err);
    res.status(500).json({ 
      error: "Error al obtener todos los comercios", 
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
      error: "Error al obtener todos los tipos de comercios",
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
      error: "Error al obtener los comercios por tipo" 
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
     const { 
         name_shop, 
         location_shop, 
         type_shop, 
         subtype_shop, 
         id_user 
     } = req.body;
 
     // Provide default values for optional fields
     const calification_shop = req.body.calification_shop || 0;
     const image_shop = req.body.image_shop || '';
 
     // Validate required fields
     if (name_shop === undefined || location_shop === undefined || type_shop === undefined || subtype_shop === undefined  || id_user === undefined) {
         console.error('-> shop_api_controller.js - create() - Error = Campos obligatorios faltantes');
         console.log(req.body);
         return res.status(400).json({
             error: 'Campos obligatorios son requeridos',
             missingFields: {
                 name_shop: !name_shop,
                 location_shop: !location_shop,
                 type_shop: !type_shop,
                 subtype_shop: !subtype_shop,
                 id_user: !id_user
             }
         });
     }
 
     const {error, data, success} = await shopController.create({
         name_shop, 
         location_shop, 
         type_shop, 
         subtype_shop, 
         id_user, 
         calification_shop, 
         image_shop
     });
 
     res.json({error, data, success});
  } catch (err) {
     console.error("-> shop_api_controller.js - create() - Error =", err);
     res.status(500).json({
         error: "Error al crear el comercio",
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
          error: 'El ID del comercio es obligatorio', 
        });
      }
      
      const {error, data} = await shopController.removeById(id_shop);
      
      res.json({ data, error });
    } catch (err) {
      console.error("-> shop_api_controller.js - removeById() - Error =", err);
      res.status(500).json({ 
        error: "Error al eliminar el comercio",
        details: err.message 
      });
    }
  }

async function removeByIdWithProducts(req, res) {
    try {
        const id_shop = req.params.id_shop;
        
        if (!id_shop) {
            res.status(400).json({ 
                error: 'El ID del comercio es obligatorio'
            });
            return;
        }

        const { error, data, success } = await shopController.removeByIdWithProducts(id_shop);

        if (error) {
            res.status(400).json({ error });
            return;
        }

        res.json({ data, success });
    } catch (err) {
        console.error("-> shop_api_controller.js - removeByIdWithProducts() - Error =", err);
        res.status(500).json({ 
            error: "Error al eliminar el comercio y sus productos",
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
        console.error('-> Error al obtener los comercios del usuario = ', err);
        res.status(500).json({
            error: 'Error al obtener los comercios del usuario',
        });
    }
};

export {
    getAll,
    getById,
    create,
    update,
    removeById,
    removeByIdWithProducts,
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
    removeByIdWithProducts,
    getByType,
    getByUserId,
    getTypesOfShops 
}