import Sequelize from "sequelize";
// const Sequelize = require("sequelize");
import dotenv from 'dotenv';
// const dotenv = require('dotenv');
dotenv.config({path: '.env'});

const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS ?? '', {
    host: process.env.BD_HOST,
    port: 3306,
    dialect: 'mysql',
    define: {
        timestamps: true,
    },
    pool: {
        max: 5, 
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorAliases: false
});

export default db;