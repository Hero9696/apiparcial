// routes/producto.routes.js

const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');

/**
 * @swagger
 * tags:
 *   - name: Productos
 *     description: Endpoints para gestionar productos
 */

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Retorna una lista de todos los productos
 *     tags: [Productos]
 *     responses:
 *       '200':
 *         description: Lista de productos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   precio:
 *                     type: number
 *                   fechaCreacion:
 *                     type: string
 *                     format: date-time
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               precio:
 *                 type: number
 *             example:
 *               nombre: "Nuevo Producto desde Swagger"
 *               precio: 19.99
 *     responses:
 *       '201':
 *         description: Producto creado exitosamente
 *       '400':
 *         description: Datos de entrada inválidos
 */
router.route('/')
  .get(productoController.getProductos)
  .post(productoController.createProducto);

/**
 * @swagger
 * /productos/{id}:
 *   get:
 *     summary: Retorna un producto por su ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del producto
 *     responses:
 *       '200':
 *         description: Producto encontrado
 *       '404':
 *         description: Producto no encontrado
 *   put:
 *     summary: Actualiza un producto existente por su ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del producto a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               precio:
 *                 type: number
 *             example:
 *               nombre: "Producto Actualizado"
 *               precio: 25.99
 *     responses:
 *       '200':
 *         description: Producto actualizado exitosamente
 *       '404':
 *         description: Producto no encontrado
 *   delete:
 *     summary: Elimina un producto por su ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del producto a eliminar
 *     responses:
 *       '200':
 *         description: Producto eliminado exitosamente
 *       '404':
 *         description: Producto no encontrado
 */
router.route('/:id')
  .get(productoController.getProductoById)
  .put(productoController.updateProducto)
  .delete(productoController.deleteProducto);

/**
 * @swagger
 * /productos/bulk:
 *   post:
 *     summary: Crea múltiples productos a la vez
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 nombre:
 *                   type: string
 *                 precio:
 *                   type: number
 *     responses:
 *       '201':
 *         description: Productos creados exitosamente
 */
router.post('/bulk', productoController.createBulkProductos);

module.exports = router;
