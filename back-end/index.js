import express from 'express'; 
import dotenv from 'dotenv';
import cors from 'cors';

import sequelize from './config/sequelize.js';
import setupAssociations from './models/associations.js'; 
import router from './routers/main_router.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());


// Middlewares
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Initialization
async function initializeDatabase() {
  try {
    // Setup model associations
    setupAssociations();

    // Synchronize models with database
    await sequelize.sync({ alter: true });

    console.log('******* SEQUELIZE: La base de datos ha sido sincronizada con el modelo ********');
  
  } catch (error) {
    console.error('!!! SEQUELIZE: Error en la sincronización de la base de datos = ', error);
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