import { validationResult, check } from "express-validator";
import { Problema, Respuestas, Categorias } from "../models/index.js";

const getProblemas = async (req, res) => {
  try {
    const problemas = await Problema.findAll({
      include: [{ model: Respuestas }, { model: Categorias }],
      order: [["id", "DESC"]],
    });

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

const getProblema = async (req, res) => {
  const { id: id_problema } = req.params;

  if (isNaN(id_problema)) {
    return res.status(404).json({
      status: 404,
      msg: "Ejercicio no encontrado",
    });
  }

  const problema = await Problema.findOne({
    include: [{ model: Respuestas }, { model: Categorias }],
    where: { id: id_problema },
  });

  if (!problema) {
    return res.status(404).json({
      status: 404,
      msg: "Ejercicio no encontrado",
    });
  }

  const { id, planteamiento, opciones, Respuesta: {opcion}, categoria: {id: id_categoria, nombre} } = problema;

  const newProblema = {
    id: id,
    planteamiento: planteamiento,
    opciones: opciones,
    respuestaCorrecta: opcion,
    categoria: id_categoria,
    nombre_categoria: nombre,
  }

  return res.status(200).json({
    status: 200,
    problema: newProblema
  });
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

const editarPregunta = async (req, res) => {
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

  try {
    const problema = await Problema.findOne({
      where: { id: req.params.id },
    });

    const respuesta = await Respuestas.findOne({
      where: {id: problema.id_respuestas}
    });
  
    const {problem, answers, correct,  id_categoria} = req.body;
    problema.planteamiento = problem;
    problema.opciones = JSON.stringify(answers);
    problema.id_categoria = id_categoria;
    respuesta.opcion = correct;
  
    problema.save();
    respuesta.save();
  
    return res.status(200).json({
      status: 200,
      msg: 'El problema se modificó correctamente'
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      msg: 'Hubo un error',
      error: error
    });
  }

}

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

const playingCategory = async (req, res) => {
  const { id } = req.params;

  const categories = await Categorias.findOne({ where: { id } });

  if (!categories) {
    return res.status(404).json({
      status: 404,
      msg: "La categoría no existe",
    });
  }

  const problemas = await Problema.findAll({ where: { id_categoria: id } });

  if (problemas.length < 5) {
    return res.status(400).json({
      status: 400,
      msg: "La categoría debe tener mas de 5 problemas",
    });
  }

  if (categories.playing == false) {
    categories.playing = true;
  } else {
    categories.playing = false;
  }
  categories.save();

  return res.status(200).json({
    status: 200,
    category: categories,
    msg: "La categoría se ha cambiado correctamente",
  });
};

export {
  getProblemas,
  getProblema,
  registrarPregunta,
  editarPregunta,
  deleteQuestion,
  getCategories,
  registerCategory,
  deleteCategory,
  playingCategory,
};
