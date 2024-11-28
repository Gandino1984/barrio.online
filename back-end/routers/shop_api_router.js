import { Router } from "express";

import shopApiController from "../controllers/shop/shop_api_controller.js";

const router = Router();

router.get("/", shopApiController.getAll);

router.post("/type", shopApiController.getByType);

router.post("/create", shopApiController.create);

router.post("/by-user-id", (req, res) => {
    shopApiController.getByUserId(req, res);
  });

router.post("/remove-by-id", shopApiController.removeById);

export default router;