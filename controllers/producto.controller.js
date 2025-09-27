// controllers/producto.controller.js

const Producto = require('../models/producto.models');

const getProductos = async (req, res) => {
    try {
        const productos = await Producto.getAll();
        res.json(productos);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const getProductoById = async (req, res) => {
    try {
        const producto = await Producto.getById(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const createProducto = async (req, res) => {
    try {
        const { nombre, precio } = req.body;
        if (!nombre || precio == null) {
            return res.status(400).json({ message: 'El nombre y el precio son requeridos' });
        }
        await Producto.create({ nombre, precio });
        res.status(201).json({ message: 'Producto creado exitosamente' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const updateProducto = async (req, res) => {
    try {
        const { nombre, precio } = req.body;
        if (!nombre || precio == null) {
            return res.status(400).json({ message: 'El nombre y el precio son requeridos' });
        }
        const result = await Producto.update(req.params.id, { nombre, precio });
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto actualizado exitosamente' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const deleteProducto = async (req, res) => {
    try {
        const result = await Producto.delete(req.params.id);
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const createBulkProductos = async (req, res) => {
    if (!Array.isArray(req.body) || req.body.length === 0) {
        return res.status(400).json({ message: 'El body debe ser un arreglo de productos.' });
    }
    try {
        const result = await Producto.createBulk(req.body);
        res.status(201).json({ message: `${result.rowsAffected} productos creados exitosamente.` });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

module.exports = {
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto,
    createBulkProductos
};