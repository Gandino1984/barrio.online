import { Router } from "express";
import productApiController from "../controllers/product/product_api_controller.js";
import { handleProductImageUpload } from '../middleware/uploadMiddleware.js';
import path from 'path';

const router = Router();

router.get("/", productApiController.getAll);
router.post("/create", productApiController.create);
router.get("/by-id/:product_id", productApiController.getById);
router.patch("/update", productApiController.update);
router.delete("/remove-by-id/:product_id", productApiController.removeById);
router.get("/by-shop-id/:id_shop", productApiController.getByShopId);
router.get("/by-type/:type_product", productApiController.getByType);
router.get("/on-sale", productApiController.getOnSale);

router.post('/upload-product-image', handleProductImageUpload, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                error: 'No file uploaded', 
                details: 'The file was not processed by Multer' 
            });
        }

        const product_id = req.body.product_id;
        const shop_name = req.body.shop_name;

        if (!product_id || !shop_name) {
            return res.status(400).json({ 
                error: 'Validation Failed', 
                details: 'Product ID and Shop Name are mandatory' 
            });
        }

        // Construct the path relative to the public directory
        const relativePath = path.join('images', 'uploads', 'shops', shop_name, 'product_images', path.basename(req.file.path))
            .split(path.sep)
            .join('/');
        
        // Update the product's image path in the database
        const result = await productApiController.updateProductImage(product_id, relativePath);
        
        if (result.error) {
            return res.status(400).json(result);
        }

        return res.json({
            ...result,
            data: {
                ...result.data,
                image_product: relativePath // Return the clean relative path
            }
        });
    } catch (error) {
        console.error('Comprehensive Upload Error:', {
            message: error.message,
            stack: error.stack
        });
        return res.status(500).json({ 
            error: 'Upload Processing Failed',
            details: error.message 
        });
    }
});

export default router;