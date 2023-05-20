import express from 'express';
import { deleteQuestion, getProblemas, registrarPregunta, editarPregunta, getProblema, getCategories, registerCategory, deleteCategory, playingCategory } from '../controllers/GameController.js';
// import upload from '../middleware/uploadImage.js';

const router = express.Router();

router.get('/panel', getProblemas);
router.post('/registrar-ejercicio', registrarPregunta);
router.get('/panel/:id', getProblema);
router.patch('/panel/:id', editarPregunta);
router.delete('/eliminar-ejercicio/:id', deleteQuestion);

router.get('/categories', getCategories);
router.post('/categories', registerCategory);
router.delete('/categories/:id', deleteCategory);

router.patch('/playing-category/:id', playingCategory);

export default router;