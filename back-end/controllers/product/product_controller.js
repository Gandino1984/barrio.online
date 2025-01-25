import product_model from "../../models/product_model.js";
import { Op } from "sequelize";
import fs from 'fs';
import path from 'path';

async function getAll() {
    try {
        const products = await product_model.findAll();

        if (!products || products.length === 0) {
            return { error: "No hay productos registrados", data: [] };
        }
        
        return { data: products,
             success: "Productos encontrados"
        };
    } catch (err) {
        console.error("-> product_controller.js - getAll() -Error =", err);
        return { error: "No hay productos registrados" };
    }
}

async function create(productData) {
    try {
        const { name_product, price_product, discount_product, season_product, calification_product, type_product, subtype_product, stock_product, info_product, id_shop} = productData;

        const product = await product_model.create({
            name_product,
            price_product,
            discount_product,
            season_product,
            calification_product,
            type_product,
            subtype_product,
            stock_product,
            info_product,
            id_shop
        });
        
        return { data: product,
            success: "Producto creado"
         };
    } catch (err) {
        console.error("-> product_controller.js - create() - Error = ", err);
        return { error: "El Producto no pudo ser creado"};
    }
}

async function getById(id) {
    try {
        const product = await product_model.findByPk(id);
        
        if (!product) {
            console.error("-> product_controller.js - getById() - producto no encontrado = ", id);
            return { error: "Producto no encontrado" };
        }
        
        return  {data: product, 
            success: "Producto encontrado"
        };
    } catch (err) {
        console.error("-> product_controller.js - getById() - Error = ", err);
        return { error: "Producto no encontrado" };
    }
}

async function update(id, productData) {
    try {
        const { name_product, price_product, discount_product, season_product, calification_product, type_product, subtype_product, stock_product, info_product, id_shop} = productData;

        const product = await product_model.findByPk(id);
        if (!product) {
            console.log("-> product_controller.js - update() - Producto no encontrado con id:", id);
            return { error: "Producto no encontrado" };
        }

        if (name_product) product.name_product = name_product;
        if (price_product >= 0) product.price_product = price_product;
        if (discount_product >= 0) product.discount_product = discount_product;
        if (season_product) product.season_product = season_product;
        if (calification_product >= 0) product.calification_product = calification_product;
        if (type_product) product.type_product = type_product;
        if (subtype_product) product.subtype_product = subtype_product;
        if (stock_product >=0) product.stock_product = stock_product;
        if (info_product) product.info_product = info_product;
        if (id_shop) product.id_shop = id_shop;
        
        await product.save();

        return { data: product,
            success: "Producto actualizado"
        };
    } catch (err) {
        console.error("-> product_controller.js - update() - Error =", err);
        return { error: "Producto no actualizado" };
    }
}

async function removeById(id_product) {
    try {
      const product = await product_model.findByPk(id_product);
  
      if (!product) {
        return { error: "Producto no encontrado" };
      }
  
      // Delete the image and folder if the product has an image
      if (product.image_product) {
        const imagePath = product.image_product;
        const folderPath = path.dirname(imagePath); // Get the folder path
        await deleteImage(id_product, imagePath, folderPath);
      }
  
      // Delete the product from the database
      await product.destroy();
  
      return { 
        data: id_product,
        success: "Producto eliminado"
      };
    } catch (err) {
      console.error("-> product_controller.js - removeById() - Error = ", err);
      return { error: "Producto no eliminado" };
    }
  }

async function removeByShopId(id_shop, transaction) {
    try {
        // Find all products for this shop first to get the count
        const products = await product_model.findAll({
            where: { id_shop: id_shop }
        });

        if (products.length === 0) {
            return { count: 0 };
        }

        // Remove all products for this shop
        await product_model.destroy({
            where: { id_shop: id_shop },
            transaction
        });

        return { 
            count: products.length,
            success: `Se eliminaron ${products.length} productos del comercio`
        };
    } catch (err) {
        console.error("-> product_controller.js - removeByShopId() - Error = ", err);
        return { error: "Error al eliminar los productos del comercio" };
    }
}

async function getByShopId(id_shop) {
    try {
        const products = await product_model.findAll({
            where: { id_shop: id_shop }
        });

        if (!products || products.length === 0) {
            return { data: [], 
                success: "No hay productos en el comercio"};
        }

        return { data: products,
            success: "Productos encontrados"
         };
    } catch (err) {
        console.error("-> product_controller.js - getByShopId() - Error = ", err);
        return { error: "Productos no encontrados" };
    }
}

async function getByType(type_product) {
    try {
        const products = await product_model.findAll({
            where: { type_product: type_product }
        });

        return { data: products,
            success: "Productos por tipo encontrados"
         };
    } catch (err) {
        console.error("-> product_controller.js - getByType() - Error = ", err);
        return { error: "Productos por tipo no encontrados" };
    }
}

async function getOnSale() {
    try {
        const products = await product_model.findAll({
            where: { discount_product: {[Op.gt]:0} }
        });

        if (!products || products.length === 0) {
            return { message: "No hay productos en oferta", data: products };
        }
        
        return { data: products,
            success: "Productos en oferta encontrados"
         };
    } catch (err) {
        console.error("-> product_controller.js - getOnSale() - Error = ", err);
        return { error: "Productos en oferta encontrados" };
    }
}

async function updateProductImage(id_product, imagePath) {
    try {
        const product = await product_model.findByPk(id_product);
        if (!product) {
            return { error: "Producto no encontrado" };
        }

        // Update the product's image path
        product.image_product = imagePath;
        await product.save();

        return { 
            data: { image_product: imagePath },
            success: "Imagen de producto actualizada correctamente"
        };
    } catch (err) {
        console.error("-> product_controller.js - updateProductImage() - Error = ", err);
        return { error: "Error al actualizar la imagen de producto" };
    }
}

async function deleteImage(id_product, imagePath, folderPath) {
    try {
      // Construct the full path to the image file
      const fullImagePath = path.join(__dirname, '../../public', imagePath);
  
      // Check if the image file exists
      if (fs.existsSync(fullImagePath)) {
        // Delete the image file
        fs.unlinkSync(fullImagePath);
        console.log(`Image deleted: ${fullImagePath}`);
      } else {
        console.log(`Image not found: ${fullImagePath}`);
      }
  
      // Construct the full path to the folder
      const fullFolderPath = path.join(__dirname, '../../public', folderPath);
  
      // Check if the folder exists and is empty
      if (fs.existsSync(fullFolderPath)) {
        const folderContents = fs.readdirSync(fullFolderPath);
        if (folderContents.length === 0) {
          // Delete the folder if it's empty
          fs.rmdirSync(fullFolderPath);
          console.log(`Folder deleted: ${fullFolderPath}`);
        } else {
          console.log(`Folder not empty: ${fullFolderPath}`);
        }
      } else {
        console.log(`Folder not found: ${fullFolderPath}`);
      }
  
      return { success: true, message: 'Imagen y carpeta eliminadas correctamente' };
    } catch (err) {
      console.error('Error deleting image and folder:', err);
      return { error: 'Error al eliminar la imagen y la carpeta', details: err.message };
    }
  }
  

export { getAll, getById, create, update, removeById, removeByShopId, getByShopId, getByType, getOnSale, updateProductImage, deleteImage}

export default { getAll, getById, create, update, removeById, removeByShopId, getByShopId, getByType, getOnSale, updateProductImage, deleteImage }