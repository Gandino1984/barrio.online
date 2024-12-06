import { Router } from "express";
import shopApiController from "../controllers/shop/shop_api_controller.js";

const router = Router();

/**
 * Define a GET endpoint at the root URL ("/") to retrieve all shops.
 * 
 * @see shopApiController.getAll for implementation details.
 */
router.get("/", shopApiController.getAll);

/**
 * Define a POST endpoint at "/type" to retrieve shops by type.
 * 
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * 
 * @see shopApiController.getByType for implementation details.
 */
router.post("/type", (req, res) => {
  shopApiController.getByType(req, res)
});

/**
 * Define a GET endpoint at "/types-of-shops" to retrieve all unique shop types.
 * 
 * @see shopApiController.getTypesOfShops for implementation details.
 */
router.get('/types-of-shops', shopApiController.getTypesOfShops);

/**
 * Define a POST endpoint at "/create" to create a new shop.
 * 
 * @see shopApiController.create for implementation details.
 */
router.post("/create", shopApiController.create);

/**
 * Define a POST endpoint at "/by-user-id" to retrieve shops by user ID.
 * 
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * 
 * @see shopApiController.getByUserId for implementation details.
 */
router.post("/by-user-id", (req, res) => {
  shopApiController.getByUserId(req, res)
});

/**
 * Define a POST endpoint at "/removeById" to remove a shop by ID.
 * 
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * 
 * @see shopApiController.removeById for implementation details.
 */
router.post("/removeById", (req, res) => {
  shopApiController.removeById(req, res)
});

export default router;