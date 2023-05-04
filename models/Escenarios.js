import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Escenario = db.define('escenarios', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: false
    },
})