// models/producto.model.js

const { sql, poolPromise } = require('../dbConfig');

class Producto {
    static async getAll() {
        try {
            const pool = await poolPromise;
            const result = await pool.request().query('SELECT * FROM Productos');
            return result.recordset;
        } catch (err) {
            throw err;
        }
    }

    static async getById(id) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('SELECT * FROM Productos WHERE id = @id');
            return result.recordset[0];
        } catch (err) {
            throw err;
        }
    }

    static async create(producto) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('nombre', sql.NVarChar, producto.nombre)
                .input('precio', sql.Decimal(10, 2), producto.precio)
                .query('INSERT INTO Productos (nombre, precio) VALUES (@nombre, @precio)');
            return result;
        } catch (err) {
            throw err;
        }
    }

    static async update(id, producto) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id', sql.Int, id)
                .input('nombre', sql.NVarChar, producto.nombre)
                .input('precio', sql.Decimal(10, 2), producto.precio)
                .query('UPDATE Productos SET nombre = @nombre, precio = @precio WHERE id = @id');
            return result;
        } catch (err) {
            throw err;
        }
    }

    static async delete(id) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM Productos WHERE id = @id');
            return result;
        } catch (err) {
            throw err;
        }
    }
    
    // Dejamos también la función de bulk insert en el modelo
    static async createBulk(productos) {
        try {
            const pool = await poolPromise;
            const table = new sql.Table('Productos');
            table.create = false;
            table.columns.add('nombre', sql.NVarChar(100), { nullable: false });
            table.columns.add('precio', sql.Decimal(10, 2), { nullable: false });

            for (const producto of productos) {
                if (producto.nombre && producto.precio != null) {
                    table.rows.add(producto.nombre, producto.precio);
                }
            }
            
            const request = pool.request();
            const result = await request.bulk(table);
            return result;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = Producto;