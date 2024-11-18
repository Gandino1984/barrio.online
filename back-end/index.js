import express from 'express'; 
import dotenv from 'dotenv';

import sequelize from './config/sequelize.js';
import router from './routers/main_router.js';

dotenv.config();

const app = express();

//middlewares
app.use(express.static("public"));//permite servir archivos estaticos
app.use(express.json()); //permite leer el body de la peticion POST/PUT tipo JSON
app.use(express.urlencoded({ extended: true })); //permite leer el body de la peticion POST/PUT tipo URL Encoded

app.use("/", router);


app.listen(3000, () => {
  console.log(`SERVER RUNNING ON PORT = ${process.env.APP_PORT}`)
})