import { Router } from "express";
import shopApiController from "../controllers/shop/shop_api_controller.js";

const router = Router();

router.get("/", shopApiController.getAll);

router.post("/type", (req, res) => {
  shopApiController.getByType(req, res)
});

router.get('/types-of-shops', shopApiController.getTypesOfShops);

router.post("/create", shopApiController.create);

router.post("/by-user-id", (req, res) => {
  shopApiController.getByUserId(req, res)
});

router.post("/removeById", (req, res) => {
  shopApiController.removeById(req, res)
});

export default router;