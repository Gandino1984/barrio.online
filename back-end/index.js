import express from 'express'; 
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './config/sequelize.js';
import router from './routers/main_router.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.use((req, res, next) => {
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

// Middlewares
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Initialization
async function initializeDatabase() {
  try {
    // Synchronize models with database
    await sequelize.sync({ alter: true });

    console.log('-> SEQUELIZE: La base de datos ha sido sincronizada con el modelo');
  
  } catch (err) {
    console.error('!!! SEQUELIZE: Error en la sincronización de la base de datos = ', err);
    process.exit(1);
  }
}

// Initialize database before starting the server
initializeDatabase().then(() => {
  app.use("/", router);

  app.use((req, res, next) => {
    console.log('***************** NEW REQUEST ****************');
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Query:', req.query);
    console.log('******************* END REQUEST *******************');
    next();
  });

  app.listen(3000, () => {
    console.log(`SERVIDOR EN EL PUERTO = ${process.env.APP_PORT}`)
  });
});