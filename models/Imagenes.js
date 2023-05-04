import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Imagenes = db.define('imagenes', {
    nombre: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    path: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    mimetype: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    id_problema: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

export default Imagenes;