import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Categorias = db.define('categorias', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    playing: {
        type: DataTypes.BOOLEAN
    }
});

export default Categorias;