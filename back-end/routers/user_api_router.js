import { Router } from "express";
import userApiController from "../controllers/user/user_api_controller.js";
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

// GET user/... routes
router.get("/", userApiController.getAll);
router.get("/:id", userApiController.getById);
router.get("/:id/update", userApiController.update);

// POST localhost:APP_PORT/user/... routes
router.post("/login", userApiController.login);
// router.post("/register", userApiController.register);
router.post("/create", userApiController.create);
router.post("/remove", userApiController.removeById);

// localhost:APP_PORT/user/ip/check
router.get('/ip/check', async (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;
    try {
      // Get current IP registration info
      const [ipInfo] = await db.query(
        'SELECT registration_count, last_attempt FROM ip WHERE ip_address = ?', [ip]
      );
      if (ipInfo.length > 0) {
        const { registration_count, last_attempt } = ipInfo[0];
        const hoursSinceLastAttempt = (Date.now() - last_attempt) / (1000 * 60 * 60);
        // Reset counter if 24 hours have passed
        if (hoursSinceLastAttempt >= RESET_HOURS) {
          await db.query(
            'UPDATE ip SET registration_count = 0, last_attempt = CURRENT_TIMESTAMP WHERE ip_address = ?', [ip]
          );
          return res.json({ canRegister: true, hoursUntilReset: 0 });
        }
        // Check if limit exceeded
        if (registration_count >= MAX_REGISTRATIONS) {
          const hoursUntilReset = RESET_HOURS - hoursSinceLastAttempt;
          return res.json({ canRegister: false, hoursUntilReset });
        }
      }
      res.json({ canRegister: true, hoursUntilReset: 0 });
    } catch (error) {
      console.error('IP check error:', error);
      res.status(500).json({ error: 'Error al verificar límites de registro' });
    }
});

// localhost:APP_PORT/user/register
router.post('/user/register', async (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;
    try {
      // Update IP registration count
      await db.query(
        `INSERT INTO ip (ip_address, registration_count, last_attempt) 
         VALUES (?, 1, CURRENT_TIMESTAMP) 
         ON DUPLICATE KEY UPDATE 
         registration_count = registration_count + 1,
         last_attempt = CURRENT_TIMESTAMP`, [ip]
      );
  
      userApiController.register;
      
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Error en el registro' });
    }
});

export default router;