import { Router } from "express";
import productApiController from "../controllers/product/product_api_controller.js";
import { uploadProductImage, processImageMiddleware } from '../middleware/uploadMiddleware.js';

const router = Router();

router.get("/", productApiController.getAll);
router.post("/create", productApiController.create);
router.get("/by-id/:id_product", productApiController.getById);
router.patch("/update", productApiController.update);
router.delete("/remove-by-id/:id_product", productApiController.removeById);
router.get("/by-shop-id/:id_shop", productApiController.getByShopId);   
router.get("/by-type/:type_product", productApiController.getByType);
router.get("/on-sale", productApiController.getOnSale);

// Add this new route for uploading product images
router.post("/upload-product-image", uploadProductImage, processImageMiddleware, productApiController.uploadProductImage);

export default router;