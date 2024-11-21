import { Router } from "express";

import userApiController from "../controllers/user/user_api_controller.js";

const router = Router();

router.get("/", userApiController.getAll);

router.post("/create", userApiController.create);

router.post("/check", userApiController.login);

router.post("/new", userApiController.register);

router.get("/:id", userApiController.getById);
// router.put("/", userApiController.update);
router.get("/:id/update", userApiController.update);
// router.delete("/:id", userApiController.removeById);
router.get("/:id/remove", userApiController.removeById);

export default router;