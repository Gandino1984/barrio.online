import { Router } from "express";

import shopApiController from "../controllers/shop/shop_api_controller.js";

const router = Router();

router.get("/", shopApiController.getAll);

// router.post("/", shopApiController.create);
router.get("/:id", shopApiController.getById);
// router.put("/", shopApiController.update);
router.get("/:id/update", shopApiController.update);
// router.delete("/:id", shopApiController.removeById);
router.get("/:id/remove", shopApiController.removeById);

router.post("/type", shopApiController.getByType);
router.post("/create", shopApiController.create);
// Add this new route
router.post("/user", shopApiController.getByUser);

export default router;