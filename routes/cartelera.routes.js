// routes/cartelera.routes.js

const express = require('express');
const router = express.Router();
const carteleraController = require('../controllers/cartelera.controller');

/**
 * @swagger
 * tags:
 *   - name: Cartelera
 *     description: Endpoints para gestionar la cartelera de películas
 */

/**
 * @swagger
 * /cartelera:
 *   get:
 *     summary: Retorna una lista de todas las películas en cartelera
 *     tags: [Cartelera]
 *     responses:
 *       '200':
 *         description: Lista de películas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pelicula'
 *   post:
 *     summary: Crea una nueva película en la cartelera
 *     tags: [Cartelera]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PeliculaInput'
 *     responses:
 *       '201':
 *         description: Película creada exitosamente
 *       '400':
 *         description: Datos de entrada inválidos
 */
router.route('/')
  .get(carteleraController.getPeliculas)
  .post(carteleraController.createPelicula);

/**
 * @swagger
 * /cartelera/{imdbID}:
 *   get:
 *     summary: Retorna una película por su imdbID
 *     tags: [Cartelera]
 *     parameters:
 *       - in: path
 *         name: imdbID
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID de IMDB de la película
 *     responses:
 *       '200':
 *         description: Película encontrada
 *       '404':
 *         description: Película no encontrada
 *   put:
 *     summary: Actualiza una película existente por su imdbID
 *     tags: [Cartelera]
 *     parameters:
 *       - in: path
 *         name: imdbID
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID de IMDB de la película a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PeliculaInput'
 *     responses:
 *       '200':
 *         description: Película actualizada exitosamente
 *       '404':
 *         description: Película no encontrada
 *   delete:
 *     summary: Elimina una película por su imdbID
 *     tags: [Cartelera]
 *     parameters:
 *       - in: path
 *         name: imdbID
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID de IMDB de la película a eliminar
 *     responses:
 *       '200':
 *         description: Película eliminada exitosamente
 *       '404':
 *         description: Película no encontrada
 */
router.route('/:imdbID')
  .get(carteleraController.getPeliculaById)
  .put(carteleraController.updatePelicula)
  .delete(carteleraController.deletePelicula);

/**
 * @swagger
 * /cartelera/bulk:
 *   post:
 *     summary: Crea múltiples películas a la vez (carga masiva)
 *     tags: [Cartelera]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/PeliculaInput'
 *     responses:
 *       '201':
 *         description: Películas creadas exitosamente
 *
 * components:
 *   schemas:
 *     Pelicula:
 *       type: object
 *       properties:
 *         imdbID:
 *           type: string
 *           description: ID único de IMDB.
 *         Title:
 *           type: string
 *           description: Título de la película.
 *         Year:
 *           type: string
 *           description: Año de lanzamiento.
 *         Type:
 *           type: string
 *           description: Género de la película.
 *         Poster:
 *           type: string
 *           description: URL del póster de la película.
 *         Estado:
 *           type: boolean
 *           description: Si la película está activa en cartelera.
 *         description:
 *           type: string
 *           description: Sinopsis de la película.
 *         Ubication:
 *           type: string
 *           description: Cine o plataforma donde se exhibe.
 *     PeliculaInput:
 *       type: object
 *       properties:
 *         imdbID:
 *           type: string
 *         Title:
 *           type: string
 *         Year:
 *           type: string
 *         Type:
 *           type: string
 *         Poster:
 *           type: string
 *         Estado:
 *           type: boolean
 *         description:
 *           type: string
 *         Ubication:
 *           type: string
 *       example:
 *         imdbID: "tt0111161"
 *         Title: "Titanes del Atlantico"
 *         Year: "2013"
 *         Type: "Ciencia Ficcion"
 *         Poster: "https://demo/demoimages.png"
 *         Estado: true
 *         description: "La humanidad se transforma en robots gigantes para defender la costa este de los monstruos que surgen del fondo del mar."
 *         Ubication: "POPCINEMA"
 */
router.post('/bulk', carteleraController.createBulkPeliculas);

module.exports = router;
