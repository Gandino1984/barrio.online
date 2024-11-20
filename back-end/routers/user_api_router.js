import { Router } from "express";

import userApiController from "../controllers/user/user_api_controller.js";

const router = Router();

router.get("/", userApiController.getAll);

// router.get("/create", userApiController.create);
router.post("/create", userApiController.create);

//route to check on login if there is a user with that name
router.post("/check", userApiController.login);

router.get("/:id", userApiController.getById);
// router.put("/", userApiController.update);
router.get("/:id/update", userApiController.update);
// router.delete("/:id", userApiController.removeById);
router.get("/:id/remove", userApiController.removeById);

export default router;