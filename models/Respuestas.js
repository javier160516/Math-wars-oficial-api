import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Respuestas = db.define('Respuestas', {
    opcion: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_problema: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

export default Respuestas;