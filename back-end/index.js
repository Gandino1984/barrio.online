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

// Middlewares
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
  exposedHeaders: ['Content-Disposition']
}));

// Database Initialization
async function initializeDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log('*******************************************************************');
    console.log('-> SEQUELIZE: La base de datos ha sido sincronizada con el modelo');
  } catch (err) {
    console.error('!!! SEQUELIZE: Error en la sincronización de la base de datos = ', err);
    process.exit(1);
  }
}

// Initialize database before starting the server
initializeDatabase().then(() => {
  app.use("/", router);

  app.listen(3000, () => {
    console.log(`SERVIDOR EN EL PUERTO = ${process.env.APP_PORT}`)
  });
});