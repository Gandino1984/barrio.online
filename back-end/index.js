import express from 'express'; 
import dotenv from 'dotenv';
import cors from 'cors';

import sequelize from './config/sequelize.js';
import router from './routers/main_router.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // allow these methods
  allowedHeaders: ['Content-Type', 'Authorization'], // allow these headers
}));

//middlewares
app.use(express.static("public"));//permite servir archivos estaticos
app.use(express.json()); //permite leer el body de la peticion POST/PUT tipo JSON
app.use(express.urlencoded({ extended: true })); //permite leer el body de la peticion POST/PUT tipo URL Encoded

app.use("/", router);

app.use((req, res, next) => {
  console.log('Incoming Request:');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});


app.listen(3000, () => {
  console.log(`SERVER RUNNING ON PORT = ${process.env.APP_PORT}`)
})


 
