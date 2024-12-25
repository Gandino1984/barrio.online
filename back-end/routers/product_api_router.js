import { Router } from "express";

import productApiController from "../controllers/product/product_api_controller.js";

const router = Router();

router.get("/", productApiController.getAll);

router.post("/create", productApiController.create);

router.patch("/update", productApiController.update);

router.delete("/remove-by-id/:id_product", productApiController.removeById);

router.post("/by-shop-id", productApiController.getByShopId);

router.get("/by-type", productApiController.getByType);

router.post("/on-sale", productApiController.getOnSale);

export default router;