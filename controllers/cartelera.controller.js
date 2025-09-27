// controllers/cartelera.controller.js

const { sql, poolPromise } = require('../dbConfig');

/**
 * Obtiene todas las películas de la cartelera.
 */
const getPeliculas = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Cartelera15029');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

/**
 * Obtiene una película por su imdbID.
 */
const getPeliculaById = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('imdbID', sql.NVarChar, req.params.imdbID)
            .query('SELECT * FROM Cartelera15029 WHERE imdbID = @imdbID');

        if (result.recordset.length === 0) {
            return res.status(404).send({ message: 'Película no encontrada.' });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

/**
 * Crea una nueva película en la cartelera.
 */
const createPelicula = async (req, res) => {
    const { imdbID, Title, Year, Type, Poster, Estado, description, Ubication } = req.body;

    if (!imdbID || !Title) {
        return res.status(400).send({ message: 'Los campos imdbID y Title son obligatorios.' });
    }

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('imdbID', sql.NVarChar, imdbID)
            .input('Title', sql.NVarChar, Title)
            .input('Year', sql.NVarChar, Year)
            .input('Type', sql.NVarChar, Type)
            .input('Poster', sql.NVarChar, Poster)
            .input('Estado', sql.Bit, Estado)
            .input('description', sql.NVarChar, description)
            .input('Ubication', sql.NVarChar, Ubication)
            .query(`
                INSERT INTO Cartelera15029 (imdbID, Title, Year, Type, Poster, Estado, description, Ubication)
                VALUES (@imdbID, @Title, @Year, @Type, @Poster, @Estado, @description, @Ubication)
            `);

        res.status(201).send({ imdbID, Title, Year, Type, Poster, Estado, description, Ubication });
    } catch (err) {
        // Manejo de error para clave primaria duplicada
        if (err.number === 2627) {
            return res.status(409).send({ message: `Ya existe una película con el imdbID: ${imdbID}` });
        }
        res.status(500).send({ message: err.message });
    }
};

/**
 * Actualiza una película existente.
 */
const updatePelicula = async (req, res) => {
    const { imdbID } = req.params;
    const { Title, Year, Type, Poster, Estado, description, Ubication } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('imdbID', sql.NVarChar, imdbID)
            .input('Title', sql.NVarChar, Title)
            .input('Year', sql.NVarChar, Year)
            .input('Type', sql.NVarChar, Type)
            .input('Poster', sql.NVarChar, Poster)
            .input('Estado', sql.Bit, Estado)
            .input('description', sql.NVarChar, description)
            .input('Ubication', sql.NVarChar, Ubication)
            .query(`
                UPDATE Cartelera15029 SET
                    Title = @Title,
                    Year = @Year,
                    Type = @Type,
                    Poster = @Poster,
                    Estado = @Estado,
                    description = @description,
                    Ubication = @Ubication
                WHERE imdbID = @imdbID
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send({ message: 'Película no encontrada para actualizar.' });
        }

        res.status(200).send({ message: 'Película actualizada exitosamente.' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

/**
 * Elimina una película de la cartelera.
 */
const deletePelicula = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('imdbID', sql.NVarChar, req.params.imdbID)
            .query('DELETE FROM Cartelera15029 WHERE imdbID = @imdbID');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send({ message: 'Película no encontrada para eliminar.' });
        }

        res.status(200).send({ message: 'Película eliminada exitosamente.' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

/**
 * Crea múltiples películas a la vez (carga masiva).
 */
const createBulkPeliculas = async (req, res) => {
    const peliculas = req.body;
    if (!Array.isArray(peliculas) || peliculas.length === 0) {
        return res.status(400).send({ message: 'El cuerpo de la solicitud debe ser un array de películas.' });
    }

    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();
        const request = new sql.Request(transaction);

        for (const p of peliculas) {
            // Aquí podrías añadir una validación más robusta para cada película
            await request.query`INSERT INTO Cartelera15029 (imdbID, Title, Year, Type, Poster, Estado, description, Ubication) VALUES (${p.imdbID}, ${p.Title}, ${p.Year}, ${p.Type}, ${p.Poster}, ${p.Estado}, ${p.description}, ${p.Ubication})`;
        }

        await transaction.commit();
        res.status(201).send({ message: `${peliculas.length} películas creadas exitosamente.` });
    } catch (err) {
        await transaction.rollback();
        res.status(500).send({ message: 'Error en la carga masiva. No se insertó ninguna película.', error: err.message });
    }
};

module.exports = {
    getPeliculas,
    getPeliculaById,
    createPelicula,
    updatePelicula,
    deletePelicula,
    createBulkPeliculas
};