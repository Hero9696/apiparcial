// dbConfig.js
require('dotenv').config();
const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true, // Requerido para Azure SQL
        trustServerCertificate: true // Cambiar a true para desarrollo local si es necesario
    }
};

// Función para conectar y asegurar que el pool esté disponible
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('✅ Conectado a SQL Server');
        return pool;
    })
    .catch(err => console.error('❌ Error de conexión con la base de datos', err));

module.exports = {
    sql,
    poolPromise
};