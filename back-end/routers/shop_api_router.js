import { Router } from "express";
import shopApiController from "../controllers/shop/shop_api_controller.js";

const router = Router();

router.get("/", shopApiController.getAll);

router.get('/types-of-shops', shopApiController.getTypesOfShops);


router.post("/by-id", shopApiController.getById);

// should be named /ByType instead of /type
router.post("/type", (req, res) => {
  shopApiController.getByType(req, res)
});

router.post("/create", shopApiController.create);

router.post("/by-user-id", (req, res) => {
  shopApiController.getByUserId(req, res)
});

router.post("/removeById", (req, res) => {
  shopApiController.removeById(req, res)
});

// get by shop name
// router.post("/by-name", (req, res) => {
//   shopApiController.getByName(req, res)
// });

router.patch("/update", shopApiController.update);



export default router;