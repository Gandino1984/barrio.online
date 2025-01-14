import express from 'express'; 
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './config/sequelize.js';
import router from './routers/main_router.js';

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middlewares
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
  exposedHeaders: ['Content-Disposition']
}));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads', 'users', req.body.name_user)); // Save to the user's folder
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Append timestamp to filename
    }
});

const upload = multer({ storage });

// Endpoint to handle file uploads
app.post('/upload', upload.single('profileImage'), (req, res) => {
    console.log(req.file); // Log file details
    res.json({ message: 'File uploaded successfully', file: req.file });
});

// middleware to handle URL-encoded paths
app.use('/uploads', (req, res, next) => {
  const filePath = decodeURIComponent(req.url);
  const fullPath = path.join(__dirname, 'uploads', filePath);
  res.sendFile(fullPath);
});

// Database Initialization
async function initializeDatabase() {
  try {
    // Synchronize models with database
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