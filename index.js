// Módulos Nativos
const path = require('path');

// Módulos de NPM
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

// Módulos Locales
const { poolPromise } = require('./dbConfig');
const carteleraRoutes = require('./routes/cartelera.routes');;

const app = express();
const port = process.env.PORT || 3000; 

// --- CONFIGURACIÓN DE SWAGGER ---
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Cartelera',
            version: '1.0.0',
            description: 'Una API para gestionar una cartelera de películas, documentada con Swagger.'
        },
       
    },
    // Le decimos a swagger-jsdoc que busque en nuestros archivos de rutas
    apis: ['./routes/cartelera.routes.js'] 
};



const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Middleware para parsear el body de las peticiones a JSON
app.use(cors());
app.use(express.json());

// --- Lógica para verificar y crear la tabla (esto se queda igual) ---
async function setupDatabase() {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        // Consulta para verificar y crear la tabla si no existe
        const createTableQuery = `
            IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Cartelera15029]') AND type in (N'U'))
            BEGIN
                CREATE TABLE [dbo].[Cartelera15029](
                    [imdbID] NVARCHAR(50) PRIMARY KEY NOT NULL,
                    [Title] NVARCHAR(255) NOT NULL,
                    [Year] NVARCHAR(10),
                    [Type] NVARCHAR(100),
                    [Poster] NVARCHAR(MAX),
                    [Estado] BIT NOT NULL DEFAULT 1,
                    [description] NVARCHAR(MAX),
                    [Ubication] NVARCHAR(100)
                ); 
                PRINT '✅ Tabla [Cartelera15029] creada exitosamente.';
            END
        `;
        await request.query(createTableQuery);
        console.log('🔍 Verificación de la base de datos completada. La tabla [Cartelera15029] está lista.');
    } catch (err) {
        console.error('❌ Error al configurar la base de datos:', err);
    }
}

// --- RUTAS DE LA API ---
// Usar las rutas de cartelera
app.use('/cartelera', carteleraRoutes);

// --- RUTA PARA LA DOCUMENTACIÓN DE SWAGGER ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Iniciar el servidor
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    // Añadimos un log para la documentación
    console.log(`📚 Documentación de Swagger disponible en http://localhost:${port}/api-docs`);
    setupDatabase();
});