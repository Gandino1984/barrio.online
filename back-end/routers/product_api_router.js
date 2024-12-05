import { Router } from "express";

import productApiController from "../controllers/product/product_api_controller.js";

const router = Router();

router.post("/by-shop-id", productApiController.getByShopId);

router.get("/by-type", productApiController.getByType);

router.post("/on-sale", productApiController.getOnSale);

export default router;