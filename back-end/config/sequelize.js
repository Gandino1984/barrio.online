import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE, 
    process.env.MYSQL_USER, 
    process.env.MYSQL_PASSWORD, {
        host: process.env.MYSQL_HOST,
        port: 3306,  
        dialect: "mysql",
        define: {
            timestamps: false,
            freezeTableName: true
        }
    }
);

async function initialize() {
    try {
        await sequelize.authenticate();
        console.log('******* SEQUELIZE: Connection has been established successfully ********');
        
    } catch (error) {
        console.error('!!!! SEQUELIZE: Unable to connect to the database !!!!!', error);
        throw error;
    }
} 

initialize();

export default sequelize;