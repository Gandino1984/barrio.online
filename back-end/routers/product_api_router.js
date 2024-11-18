import { Router } from "express";

import productApiController from "../controllers/product/product_api_controller.js";

const router = Router();

router.get("/", productApiController.getAll);
router.get("/create", productApiController.create);
// router.post("/", productApiController.create);
router.get("/:id", productApiController.getById);
// router.put("/", productApiController.update);
router.get("/:id/update", productApiController.update);
// router.delete("/:id", productApiController.removeById);
router.get("/:id/remove", productApiController.removeById);

export default router;