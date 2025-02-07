import shopController from "./shop_controller.js";
import productController from "../product/product_controller.js";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import shop_model from "../../models/shop_model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  try {
      const {
          id_shop,
          name_shop,
          location_shop,
          type_shop,
          subtype_shop,
          id_user,
          calification_shop,
          image_shop
      } = req.body;

      // Validate required fields
      if (!id_shop) {
          return res.status(400).json({
              error: 'El ID del comercio es obligatorio'
          });
      }

      const updateData = {
          name_shop,
          location_shop,
          type_shop,
          subtype_shop,
          id_user,
          calification_shop,
          image_shop
      };

      const {error, data} = await shopController.update(id_shop, updateData);
      
      if (error) {
          return res.status(400).json({ error });
      }

      res.json({ error, data });
  } catch (err) {
      console.error("-> shop_api_controller.js - update() - Error =", err);
      res.status(500).json({
          error: "Error al actualizar el comercio",
          details: err.message
      });
  }
}

async function updateWithFolder(req, res) {
    try {
        const {
            id_shop,
            name_shop,
            location_shop,
            type_shop,
            subtype_shop,
            id_user,
            calification_shop,
            image_shop,
            old_name_shop
        } = req.body;

        if (!id_shop || !name_shop || !old_name_shop) {
            return res.status(400).json({
                error: 'Shop ID, new name, and old name are required'
            });
        }

        const updateData = {
            name_shop,
            location_shop,
            type_shop,
            subtype_shop,
            id_user,
            calification_shop,
            image_shop,
            old_name_shop // Make sure to pass this through
        };

        const { error, data } = await shopController.updateWithFolder(id_shop, updateData);
        
        if (error) {
            return res.status(400).json({ error });
        }

        res.json({ 
            error: null, 
            data,
            message: 'Shop updated successfully with folder structure and image paths'
        });
    } catch (err) {
        console.error("Error in updateWithFolder:", err);
        res.status(500).json({
            error: "Error updating shop and associated data",
            details: err.message
        });
    }
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

async function uploadCoverImage(req, res) {
  try {
      const id_shop = req.headers['x-shop-id'];
      
      if (!id_shop) {
          return res.status(400).json({
              error: 'Shop ID is required'
          });
      }

      if (!req.file) {
          return res.status(400).json({
              error: 'No file uploaded'
          });
      }

      // Construct the relative path for storing in the database
      const relativePath = path.join('images', 'uploads', 'shops', 'covers', req.file.filename)
          .replace(/\\/g, '/'); // Convert Windows-style paths to URL-style paths

      // Update the shop's image_shop field in the database using the controller
      const { error, data } = await shopController.update(id_shop, {
          image_shop: relativePath
      });

      if (error) {
          // If there was an error updating the database, delete the uploaded file
          const filePath = path.join(__dirname, '..', '..', 'public', relativePath);
          try {
              await fs.unlink(filePath);
          } catch (unlinkError) {
              console.error('Error deleting uploaded file:', unlinkError);
          }
          
          return res.status(500).json({
              error: 'Failed to update shop with new image',
              details: error
          });
      }

      // Return the updated image path
      res.json({
          error: null,
          data: {
              image_shop: relativePath
          }
      });

  } catch (err) {
      console.error('Error uploading shop cover image:', err);
      res.status(500).json({
          error: 'Error uploading shop cover image',
          details: err.message
      });
  }
}

export {
    getAll,
    getById,
    create,
    update,
    removeById,
    removeByIdWithProducts,
    getByType,
    getByUserId,
    getTypesOfShops,
    updateWithFolder,
    uploadCoverImage
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
    getTypesOfShops,
    updateWithFolder,
    uploadCoverImage
}