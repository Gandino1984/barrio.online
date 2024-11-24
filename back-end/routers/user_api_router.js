import { Router } from "express";
import userApiController from "../controllers/user/user_api_controller.js";
import dotenv from 'dotenv';
import pool from '../../db/db.js';

dotenv.config();

const router = Router();
const MAX_REGISTRATIONS = parseInt(process.env.MAX_REGISTRATIONS) || 2;
const RESET_HOURS = parseInt(process.env.RESET_HOURS) || 24;

// GET user/... routes
router.get("/", userApiController.getAll);
router.get("/:id", userApiController.getById);
router.get("/:id/update", userApiController.update);

// POST localhost:APP_PORT/user/... routes
router.post("/login", userApiController.login);
router.post("/create", userApiController.create);
router.post("/remove", userApiController.removeById);

// localhost:APP_PORT/user/ip/check
router.get('/ip/check', async (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;
    try {
        // Get current IP registration info
        const [rows] = await pool.query(
            'SELECT registration_count, last_attempt FROM ip_registry WHERE ip_address = ?', 
            [ip]
        );
        
        if (rows.length > 0) {
            const { registration_count, last_attempt } = rows[0];
            const hoursSinceLastAttempt = (Date.now() - new Date(last_attempt).getTime()) / (1000 * 60 * 60);
            
            // Reset counter if RESET_HOURS have passed
            if (hoursSinceLastAttempt >= RESET_HOURS) {
                await pool.query(
                    'UPDATE ip_registry SET registration_count = 0, last_attempt = CURRENT_TIMESTAMP WHERE ip_address = ?', 
                    [ip]
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
router.post('/register', async (req, res) => {
    console.log('Register endpoint hit');  
    const ip = req.ip || req.connection.remoteAddress;
    try {
        // First check if registration is allowed
        const [rows] = await pool.query(
            'SELECT registration_count, last_attempt FROM ip_registry WHERE ip_address = ?', 
            [ip]
        );
        
        const now = new Date();
        let canRegister = true;
        
        if (rows.length > 0) {
            const { registration_count, last_attempt } = rows[0];
            const hoursSinceLastAttempt = (now.getTime() - new Date(last_attempt).getTime()) / (1000 * 60 * 60);
            
            if (hoursSinceLastAttempt < RESET_HOURS && registration_count >= MAX_REGISTRATIONS) {
                canRegister = false;
            }
        }
        
        if (!canRegister) {
            return res.status(429).json({ 
                error: 'Has excedido el límite de registros permitidos. Por favor, intenta más tarde.' 
            });
        }

        // Update IP registration count
        await pool.query(
            `INSERT INTO ip_registry (ip_address, registration_count, last_attempt) 
             VALUES (?, 1, CURRENT_TIMESTAMP) 
             ON DUPLICATE KEY UPDATE 
             registration_count = IF(TIMESTAMPDIFF(HOUR, last_attempt, CURRENT_TIMESTAMP) >= ?, 1, registration_count + 1),
             last_attempt = CURRENT_TIMESTAMP`, 
            [ip, RESET_HOURS]
        );

        // Now proceed with the actual registration
        await userApiController.register(req, res);
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Error en el registro' });
    }
});

export default router;