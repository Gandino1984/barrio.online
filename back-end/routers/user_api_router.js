import { Router } from "express";
import userApiController from "../controllers/user/user_api_controller.js";

const router = Router();

// GET routes
router.get("/", userApiController.getAll);
router.get("/:id", userApiController.getById);
router.get("/:id/update", userApiController.update);
router.get("/:id/update", userApiController.update);

// POST routes
router.post("/login", userApiController.login);
router.post("/register", userApiController.register);
router.post("/create", userApiController.create);
router.post("/remove", userApiController.removeById);

export default router;