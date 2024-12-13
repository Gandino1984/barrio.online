import { Router } from "express";
import userApiController from "../controllers/user/user_api_controller.js";
import IpRegistry from '../../back-end/models/ip_registry_model.js'; 
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

const MAX_REGISTRATIONS = parseInt(process.env.MAX_REGISTRATIONS) || 2;

const RESET_HOURS = parseInt(process.env.RESET_HOURS) || 24;


router.get("/", userApiController.getAll);

// router.get("/:id", userApiController.getById);

// router.get("/:id/update", userApiController.update);

router.get('/ip/check', async (req, res) => {
    const userIp = req.socket.remoteAddress;

    try {
        const [ipRecord, created] = await IpRegistry.findOrCreate({
            where: { ip_address: userIp },
            defaults: {
                registration_count: 0,
                last_attempt: new Date()
            }
        });

        console.log("-> user_api_router - /ip/check - IP Record = ", ipRecord);
        
        if (!created) {
            console.log("->  /ip/check - Su dirección IP no ha sido registrada");
            
            const hoursSinceLastAttempt = (Date.now() - new Date(ipRecord.last_attempt).getTime()) / (1000 * 60 * 60); 
            
            // Reset counter if RESET_HOURS have passed
            if (hoursSinceLastAttempt >= RESET_HOURS) {
                await ipRecord.update({
                    registration_count: 0,
                    last_attempt: new Date()
                });
                return res.json({ canRegister: true, hoursUntilReset: 0 });
            }
            // Check if limit exceeded
            if (ipRecord.registration_count >= MAX_REGISTRATIONS) {
                const hoursUntilReset = RESET_HOURS - hoursSinceLastAttempt;
                return res.json({ canRegister: false, hoursUntilReset });
            }
        }
        res.json({ canRegister: true, hoursUntilReset: 0 });

    } catch (error) {

        console.error('IP check error:', {
            message: error.message,
            stack: error.stack
        });
        
        if (error.name === 'SequelizeConnectionError') {
            res.status(500).json({ 
                error: 'La conexión con la base de datos ha fallado',
                details: 'Unable to connect to the database'
            });
        } else {
            res.status(500).json({ 
                error: 'Error en la comprobación de la IP',
                details: error.message
            });
        }
    }
});

router.post("/login", userApiController.login);

router.post("/create", userApiController.create);

router.post("/remove", userApiController.removeById);

router.post('/register', async (req, res) => {
    console.log('-> Register endpoint hit');

    const userIp = req.ip || req.socket.remoteAddress;
    console.log('-> /registerI - IP del usuario:', userIp);

    try {
        const [ipRecord, created] = await IpRegistry.findOrCreate({
            where: { ip_address: userIp },
            defaults: {
                registration_count: 0,
                last_attempt: new Date()
            }
        });
        const hoursSinceLastAttempt = created ? 0 : (Date.now() - new Date(ipRecord.last_attempt).getTime()) / (1000 * 60 * 60);
        if (!created && hoursSinceLastAttempt < RESET_HOURS && ipRecord.registration_count >= MAX_REGISTRATIONS) {
            return res.status(429).json({ 
                error: 'Has excedido el límite de registros permitidos.' 
            });
        }
        // Update registration count
        await ipRecord.update({
            registration_count: hoursSinceLastAttempt >= RESET_HOURS ? 1 : ipRecord.registration_count + 1,
            last_attempt: new Date()
        });

        await userApiController.register(req, res);

    } catch (error) {
        console.error('-> Registration error:', error);
        res.status(500).json({ error: 'Error en el registro' });
    }
});

router.post("/details", userApiController.getByUserName);


export default router;