import { validationResult, check } from "express-validator";
import { Problema, Respuestas, Categorias } from "../models/index.js";
import db from "../config/db.js";
import { QueryTypes } from "sequelize";

const getProblemas = async (req, res) => {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  try {
    // const problemas = await Problema.findAll();
    // const imagenes = await Imagenes.findAll();
    // const respuestas = await Respuestas.findAll();

    // const problemas = await db.query(
    //   `
    //         SELECT p.id, p.planteamiento, p.opciones, r.opcion, c.nombre
    //         FROM problemas as p
    //         INNER JOIN respuestas as r ON r.id_problema = p.id
    //         INNER JOIN categorias as c ON c.id = p.id
    //     `,
    //   { type: QueryTypes.SELECT }
    // );
    const problemas = await Problema.findAll({include: [{model: Respuestas}, {model: Categorias}]}); 

    const newArrayProblemas = [];
    // Object.values(problemas).forEach((problema) => {
    //   const problemaObjeto = {
    //     id: problema.id,
    //     planteamiento: problema.planteamiento,
    //     respuestas: problema.opciones,
    //     categoria: problema.nombre,
    //     opcion: problema.opcion,
    //   };
    //   newArrayProblemas.push(problemaObjeto);
    // });

    return res.status(200).json({
      status: 200,
      data: problemas,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      msg: "Ha ocurrido un error",
    });
  }
};

const registrarPregunta = async (req, res) => {
  await check("problem")
    .notEmpty()
    .withMessage("El campo es obligatorio")
    .run(req);
  await check("answers")
    .notEmpty()
    .withMessage("Las respuestas son obligatorias")
    .run(req);
  await check("correct")
    .notEmpty()
    .withMessage("El campo es obligatorio")
    .run(req);
  await check("id_categoria")
    .notEmpty()
    .withMessage("La categoría es obligatoria")
    .run(req);

  console.log(req.body);

  let result = validationResult(req);
  let errors = {};
  result.array().map((resultState) => {
    const { param, msg } = resultState;
    if (param == "problem") {
      errors = { ...errors, problem: msg };
    }
    if (param == "answers") {
      errors = { ...errors, options: msg };
    }
    if (param == "correct") {
      errors = { ...errors, correct: msg };
    }
    if (param == "id_categoria") {
      errors = { ...errors, id_categoria: msg };
    }
  });

  if (!result.isEmpty()) {
    return res.status(400).json({
      status: 400,
      errors: errors,
    });
  }

  const { problem, answers, correct: correctAnswer, id_categoria } = req.body;
  console.log(req.body);

  try {
    const correct = await Respuestas.create({
      opcion: correctAnswer,
    });
    
    const { id } = correct;
    const problema = await Problema.create({
      planteamiento: problem,
      opciones: JSON.stringify(answers),
      id_respuestas: id,
      id_categoria: id_categoria,
    });

    return res.status(201).json({
      status: 201,
      problema: id,
      msg: "Pregunta creada correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      msg: "Ha ocurrido un error",
    });
  }
};

// const guardarImagen = async (req, res) => {
//     console.log(req.params);
//     const arrayPathFiles = [];
//     const arrayNameFiles = [];
//     const arrayMimetypesFiles = [];

//     req.files.forEach(file => {
//         const { path, filename, mimetype } = file;
//         arrayPathFiles.push(`${path}`);
//         arrayNameFiles.push(filename);
//         arrayMimetypesFiles.push(mimetype);
//     });

//     const { id } = req.params;

//     const imagenes = await Imagenes.create({
//         nombre: JSON.stringify(arrayNameFiles),
//         path: JSON.stringify(arrayPathFiles),
//         mimetype: JSON.stringify(arrayMimetypesFiles),
//         id_problema: id
//     });

//     return res.status(201).json({
//         status: 201,
//         msg: 'Pregunta creada correctamente'
//     });
// }

const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  const question = await Problema.findOne({ where: { id } });
  if (!question) {
    return res.status(404).json({
      status: 404,
      msg: "Pregunta no encontrada",
    });
  }
  try {
    await Problema.destroy({ where: { id } });
    return res.status(200).json({
      status: 200,
      msg: "Problema eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      msg: "No hemos podido eliminar el registro",
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Categorias.findAll();
    return res.status(200).json({
      categories: categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      msg: "Ha ocurrido un error",
    });
  }
};

const registerCategory = async (req, res) => {
  await check("name")
    .notEmpty()
    .withMessage("El campo es obligatorio")
    .run(req);
  console.log(req.body);

  let result = validationResult(req);
  let errors = {};
  result.array().map((resultState) => {
    const { param, msg } = resultState;
    if (param == "name") {
      errors = { ...errors, name: msg };
    }
  });

  if (!result.isEmpty()) {
    return res.status(400).json({
      status: 400,
      errors: errors,
    });
  }

  const { name } = req.body;

  try {
    const cartegory = await Categorias.create({
      nombre: name,
    });

    return res.status(201).json({
      status: 201,
      msg: "Categoría creada correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      msg: "Ha ocurrido un error",
    });
  }
};

const deleteCategory = async (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  const category = await Categorias.findOne({ where: { id } });
  if (!category) {
    return res.status(404).json({
      status: 404,
      msg: "Categoría no encontrada",
    });
  }

  try {
    await Categorias.destroy({ where: { id } });
    return res.status(200).json({
      status: 200,
      msg: "Categoría eliminada correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      title: "¡Ops, hubo un error!",
      msg: "No hemos podido eliminar el registro ya que un problema está asociado a esta categoría",
    });
  }
};

export {
  getProblemas,
  registrarPregunta,
  deleteQuestion,
  getCategories,
  registerCategory,
  deleteCategory,
};
