// index.js

const express = require('express');
const { poolPromise } = require('./dbConfig');
const productoRoutes = require('./routes/producto.routes');

// --- NUEVAS IMPORTACIONES PARA SWAGGER ---
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000; 

// --- CONFIGURACIÓN DE SWAGGER ---
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Productos',
            version: '1.0.0',
            description: 'Una API simple para gestionar un CRUD de productos, documentada con Swagger.'
        },
        servers: [
            {
                url: `http://localhost:${port}`
            }
        ]
    },
    // Le decimos a swagger-jsdoc que busque en nuestros archivos de rutas
    apis: ['./routes/producto.routes.js'] 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Middleware para parsear el body de las peticiones a JSON
app.use(express.json());

// --- Lógica para verificar y crear la tabla (esto se queda igual) ---
async function setupDatabase() { /* ... tu función setupDatabase ... */ }

// --- RUTAS DE LA API ---
// Usar las rutas de productos
app.use('/productos', productoRoutes);

// --- RUTA PARA LA DOCUMENTACIÓN DE SWAGGER ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Iniciar el servidor
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    // Añadimos un log para la documentación
    console.log(`📚 Documentación de Swagger disponible en http://localhost:${port}/api-docs`);
    setupDatabase();
});