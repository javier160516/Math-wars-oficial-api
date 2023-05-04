import Imagenes from "./Imagenes.js";
import Problema from "./Problemas.js";
import Respuestas from "./Respuestas.js";
import Categorias from "./Categorias.js";

Problema.hasMany(Imagenes, {foreignKey: 'id_problema'});
Problema.hasMany(Respuestas, {foreignKey: 'id_problema'});
Problema.belongsTo(Categorias, {foreignKey: 'id_categoria'})

export {
    Problema, 
    Imagenes,
    Respuestas,
    Categorias
}