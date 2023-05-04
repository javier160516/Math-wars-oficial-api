import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Personaje = db.define('personajes', {
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    }
});

export default Personaje;