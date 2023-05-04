import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Problema = db.define('problemas', {
    planteamiento:{
        type: DataTypes.STRING,
        allowNull: false
    },
    id_respuestas: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    opciones: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

export default Problema;