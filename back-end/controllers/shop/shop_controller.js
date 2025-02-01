import shop_model from "../../models/shop_model.js";
import user_model from "../../models/user_model.js";
import productController from "../product/product_controller.js";
import product_model from "../../models/product_model.js";
import { Op } from 'sequelize';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getAll() {
    try {
        const shops = await shop_model.findAll();

        if (!shops || shops.length === 0) {
            return { error: "No hay comercios registrados", data: [] };
        }

        console.log("-> shop_controller.js - getAll() - comercios encontrados = ", shops);

        return { data: shops };
    } catch (err) {
        console.error("-> shop_controller.js - getAll() -Error = ", err);
        return { error: "Error al obtener todos los comercios" };
    }
}

async function create(shopData) {
    try {
        // Check if user already exists by name
        console.log('-> shop_controller.js - create() - Buscando shopData.name_shop en la DB = ', shopData.name_shop);

        const existingShop = await shop_model.findOne({ 
            where: { name_shop: shopData.name_shop } 
        });

        if (existingShop) {
            console.error("Ya existe una comercio con ese nombre");
            return { 
                error: "Ya existe una comercio con ese nombre", 
                data: data 
            };
        }

        // If no existing shop, proceed with creation
        const shop = await shop_model.create(shopData);
        
        return { data: shop, 
            success: "comercio creado"
        };
    } catch (err) {
        console.error("-> shop_controller.js - create() - Error al crear el comercio =", err);
        return { error: "Error al crear el comercio" };
    }
}

async function getByType(shopType) {
    try {
        const shops = await shop_model.findAll({ 
            where: { type_shop: shopType }
        });

        if (shops.length === 0) {
            console.warn(`No hay comercios registrados de tipo =  ${shopType}`);
            return { error: "No hay comercios registrados de este tipo" }
             }

        return { data: shops };
    
    } catch (err) {
        console.error("-> shop_controller.js - getByType() - Error = ", err);
        return { error: "Error al obtener los comercios por tipo" };
    }
}

async function update(id, shopData) {
    try {
        const { name_shop, location_shop, type_shop } = shopData;

        const shop = await shop_model.findByPk(id);
        
        if (!shop) {
            console.log("shop not found with id:", id);
            return { error: "shop not found" };
        }
        // Only update fields that were provided
        if (name_shop) shop.name_shop = name_shop;
        if (location_shop) shop.location_shop = location_shop;
        if (type_shop) shop.type_shop = type_shop;

        await shop.save();
        
        console.log("Updated shop:", shop);
        return { data: shop };
    } catch (err) {
        console.error("Error al actualizar el comercio =", err);
        return { error: "Error al actualizar el comercio" };
    }
}

async function updateProductImagePaths(oldShopName, newShopName, transaction) {
    try {
        const products = await product_model.findAll({
            where: { 
                image_product: {
                    [Op.like]: `%/shops/${oldShopName}/%`
                }
            },
            transaction
        });

        for (const product of products) {
            const newImagePath = product.image_product.replace(
                `/shops/${oldShopName}/`,
                `/shops/${newShopName}/`
            );
            await product.update({ 
                image_product: newImagePath 
            }, { transaction });
        }

        return { success: true };
    } catch (err) {
        console.error("Error updating product image paths:", err);
        throw err;
    }
}

async function updateWithFolder(id, shopData) {
    const transaction = await shop_model.sequelize.transaction();
    
    try {
        const shop = await shop_model.findByPk(id, { transaction });
        
        if (!shop) {
            await transaction.rollback();
            return { error: "Shop not found" };
        }

        const oldShopName = shopData.old_name_shop;
        const newShopName = shopData.name_shop;

        // Remove old_name_shop from shopData before update
        const updateData = { ...shopData };
        delete updateData.old_name_shop;

        // Update shop data
        await shop.update(updateData, { transaction });

        // If shop name has changed, update folder structure
        if (oldShopName !== newShopName) {
            try {
                // Get absolute paths
                const baseDir = path.resolve(__dirname, '..', '..', 'public', 'images', 'uploads', 'shops');
                const oldShopPath = path.join(baseDir, oldShopName);
                const newShopPath = path.join(baseDir, newShopName);

                console.log('Directory paths:', {
                    baseDir,
                    oldShopPath,
                    newShopPath
                });

                // First check if old directory exists
                try {
                    await fs.access(oldShopPath);
                    console.log(`Found old shop directory: ${oldShopPath}`);
                } catch (err) {
                    console.error(`Old shop directory not found: ${oldShopPath}`);
                    throw err;
                }

                // Create new shop directory if it doesn't exist
                await fs.mkdir(newShopPath, { recursive: true });
                console.log(`Created new shop directory: ${newShopPath}`);

                // Copy all contents from old to new directory
                const copyDirectory = async (source, destination) => {
                    const entries = await fs.readdir(source, { withFileTypes: true });
                    
                    for (const entry of entries) {
                        const srcPath = path.join(source, entry.name);
                        const destPath = path.join(destination, entry.name);
                        
                        if (entry.isDirectory()) {
                            await fs.mkdir(destPath, { recursive: true });
                            await fs.chmod(destPath, 0o755);
                            await copyDirectory(srcPath, destPath);
                        } else {
                            await fs.copyFile(srcPath, destPath);
                            await fs.chmod(destPath, 0o644);
                        }
                    }
                };

                // Copy everything from old to new location
                await copyDirectory(oldShopPath, newShopPath);
                console.log('Finished copying all files and directories');

                // Verify new directory exists before deleting old one
                try {
                    await fs.access(newShopPath);
                    console.log('Successfully verified new directory exists');
                    
                    // Remove old directory
                    await fs.rm(oldShopPath, { recursive: true });
                    console.log(`Successfully removed old directory: ${oldShopPath}`);
                } catch (err) {
                    console.error('Error verifying new directory or removing old one:', err);
                    throw err;
                }

                // Update product image paths in database
                await updateProductImagePaths(oldShopName, newShopName, transaction);
                console.log('Updated product image paths in database');
            } catch (err) {
                console.error('Error handling directories:', err);
                throw err;
            }
        }

        await transaction.commit();
        return { 
            data: shop,
            message: "Shop updated successfully" 
        };
    } catch (err) {
        await transaction.rollback();
        console.error("Error updating shop with folder:", err);
        return { 
            error: "Error updating shop and associated data",
            details: err.message 
        };
    }
}

async function getByUserId(id) {
    try {
        const shops = await shop_model.findAll({ 
            where: { id_user: id }
        }); 

        console.log(`-> shop_controller.js - getByUserId() - Retrieved shops for user ${id}:`, shops);
        
        if (shops.length === 0) {
            console.log(`-> shop_controller.js - getByUserId() - No shops found for user ID: ${id}`);
            return { error: "No se encontraron comercios para este usuario" };
        }
        return { data: shops };
    } catch (err) {
        console.error("-> shop_controller.js - getByUserId() - Error = ", err);
        return { error: "Error al obtener los comercios del usuario" };
    }
}

async function removeById(id_shop) {
    try {
        if (!id_shop) {
            return { error: "comercio no encontrado" };
        }

        const shop = await shop_model.findByPk(id_shop);
        
        if (!shop) {
            return { 
                error: "comercio no encontrado",
            };
        }
   
        await shop.destroy();

      return { 
        data:  id_shop,
        message: "El comercio se ha borrado correctamente" 
        };
    } catch (err) {
      console.error("-> shop_controller.js - removeById() - Error = ", err);
      return { error: "Error al borrar el comercio" };
    }
}

async function removeByIdWithProducts(id_shop) {
    try {
        if (!id_shop) {
            return { error: "ID de comercio no proporcionado" };
        }

        // First check if the shop exists
        const shop = await shop_model.findByPk(id_shop);
        
        if (!shop) {
            return { 
                error: "Comercio no encontrado"
            };
        }

        const transaction = await shop_model.sequelize.transaction();

        try {
            // First remove all products using the product controller
            const productResult = await productController.removeByShopId(id_shop, transaction);
            
            if (productResult.error) {
                await transaction.rollback();
                return { error: productResult.error };
            }

            // Then remove the shop
            await shop.destroy({ transaction });

            // If we get here, commit the transaction
            await transaction.commit();

            return { 
                data: id_shop,
                message: "El comercio y sus productos se han borrado correctamente",
                productsRemoved: productResult.count
            };

        } catch (err) {
            await transaction.rollback();
            throw err;
        }

    } catch (err) {
        console.error("-> shop_controller.js - removeByIdWithProducts() - Error = ", err);
        return { error: "Error al borrar el comercio y sus productos",
            details: err.message
         };
    }
}

async function getTypesOfShops() {
    try {
      const shopTypes = await shop_model.findAll({
        attributes: ['type_shop'],
        group: ['type_shop'],
      });
      return { data: shopTypes.map((type) => type.type_shop) };
    } catch (err) {
      console.error('Error al obtener todos los tipos de comercios', err);
      return { error: 'Error al obtener todos los tipos de comercios' };
    }
}



export { getAll, 
    create, 
    update, 
    removeById, 
    removeByIdWithProducts,
    getByType, 
    getByUserId, 
    getTypesOfShops,
    updateWithFolder 
}

export default { 
    getAll, 
    create, 
    update, 
    removeById,
    removeByIdWithProducts, 
    getByType, 
    getByUserId, 
    getTypesOfShops,
    updateWithFolder 
}