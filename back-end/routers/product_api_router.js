import { Router } from "express";

import productApiController from "../controllers/product/product_api_controller.js";

const router = Router();

router.get("/", productApiController.getAll);

router.post("/create", productApiController.create);

router.get("/by-id/:id_product", productApiController.getById);

router.patch("/update", productApiController.update);

router.delete("/remove-by-id/:id_product", productApiController.removeById);

router.get("/by-shop-id/:id_shop", productApiController.getByShopId);   

router.get("/by-type/:type_product", productApiController.getByType);

router.get("/on-sale", productApiController.getOnSale);

export default router;