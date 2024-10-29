const express = require('express'); // Importa el módulo Express para crear el servidor
const fs = require('fs'); // Importa el módulo fs para trabajar con el sistema de archivos
const csv = require('csv-parser'); // Importa csv-parser para leer archivos CSV
const { Parser } = require('json2csv'); // Importa json2csv para convertir datos JSON a CSV
const cors = require('cors'); // Importa cors para permitir solicitudes cruzadas
const bodyParser = require('body-parser'); // Importa body-parser para parsear cuerpos de solicitud

const app = express(); // Crea una instancia de la aplicación Express
const PORT = 3000; // Define el puerto en el que se ejecutará el servidor
const CSV_FILE = 'data.csv'; // Nombre del archivo CSV que se utilizará

app.use(cors()); // Habilita CORS para todas las rutas
app.use(bodyParser.json()); // Configura el middleware para parsear JSON en el cuerpo de la solicitud

// Leer el archivo CSV y devolver los registros
app.get('/api/data', (req, res) => {
    const results = []; // Arreglo para almacenar los resultados leídos
    fs.createReadStream(CSV_FILE) // Crea un flujo de lectura para el archivo CSV
        .pipe(csv()) // Procesa el archivo CSV
        .on('data', (data) => results.push(data)) // Almacena cada fila en el arreglo results
        .on('end', () => {
            res.json(results); // Envía los resultados como respuesta en formato JSON
        })
        .on('error', (err) => {
            console.error(err); // Imprime el error en la consola
            res.status(500).send('Error al leer el archivo.'); // Envía un mensaje de error si ocurre un problema
        });
});

// Agregar un nuevo registro
app.post('/api/data', (req, res) => {
    const newRecord = { ...req.body, id: Date.now().toString() }; // Crea un nuevo registro con un ID único
    const results = []; // Arreglo para almacenar los registros existentes

    fs.createReadStream(CSV_FILE) // Crea un flujo de lectura para el archivo CSV
        .pipe(csv())
        .on('data', (data) => results.push(data)) // Almacena cada fila en el arreglo results
        .on('end', () => {
            const records = [...results, newRecord]; // Agrega el nuevo registro a los registros existentes
            const csvData = new Parser().parse(records); // Convierte los registros a formato CSV
            fs.writeFileSync(CSV_FILE, csvData); // Escribe los datos CSV en el archivo
            res.status(201).json({ message: 'Registro agregado correctamente.', record: newRecord }); // Responde con el nuevo registro
        })
        .on('error', (err) => {
            console.error(err); // Imprime el error en la consola
            res.status(500).send('Error al agregar el registro.'); // Envía un mensaje de error si ocurre un problema
        });
});

// Eliminar un registro
app.delete('/api/data/:id', (req, res) => {
    const id = req.params.id; // Obtiene el ID del registro a eliminar
    const records = [];

    fs.createReadStream(CSV_FILE)
        .pipe(csv())
        .on('data', (data) => {
            if (data.id !== id) { // Solo almacena registros que no coincidan con el ID
                records.push(data);
            }
        })
        .on('end', () => {
            const csvData = new Parser().parse(records); // Convierte los registros restantes a formato CSV
            fs.writeFileSync(CSV_FILE, csvData); // Escribe los datos CSV en el archivo
            res.status(204).end(); // Responde con un estado 204 (Sin contenido)
        })
        .on('error', (err) => {
            console.error(err);
            res.status(500).send('Error al eliminar el registro.');
        });
});

// Modificar un registro
app.put('/api/data/:id', (req, res) => {
    const id = req.params.id; // Obtiene el ID del registro a modificar
    const updatedRecord = { ...req.body, id }; // Crea el registro actualizado manteniendo el ID
    const records = []; // Arreglo para almacenar los registros existentes

    fs.createReadStream(CSV_FILE) // Crea un flujo de lectura para el archivo CSV
        .pipe(csv())
        .on('data', (data) => {
            if (data.id === id) { // Si el ID coincide, almacena el registro actualizado
                records.push(updatedRecord);
            } else {
                records.push(data); // De lo contrario, almacena el registro original
            }
        })
        .on('end', () => {
            const csvData = new Parser().parse(records); // Convierte los registros a formato CSV
            fs.writeFileSync(CSV_FILE, csvData); // Escribe los datos CSV en el archivo
            res.json({ message: 'Registro actualizado correctamente.', record: updatedRecord }); // Responde con el registro actualizado
        })
        .on('error', (err) => {
            console.error(err); // Imprime el error en la consola
            res.status(500).send('Error al actualizar el registro.'); // Envía un mensaje de error si ocurre un problema
        });
});

// Endpoint para buscar registros con múltiples filtros
app.get('/api/data/search', (req, res) => {
    const { title, season, imdb_rating, tmdb_rating, directed_by } = req.query; // Obtiene los filtros de búsqueda
    const results = []; // Arreglo para almacenar los resultados de la búsqueda

    fs.createReadStream(CSV_FILE) // Crea un flujo de lectura para el archivo CSV
        .pipe(csv())
        .on('data', (data) => {
            const matchesTitle = title ? data.title.toLowerCase().includes(title.toLowerCase()) : true; // Verifica si el título coincide
            const matchesSeason = season ? parseInt(data.season) === parseInt(season) : true; // Verifica si la temporada coincide
            const matchesImdb = imdb_rating ? parseFloat(data.imdb_rating) >= parseFloat(imdb_rating) : true; // Verifica calificación IMDB
            const matchesTmdb = tmdb_rating ? parseFloat(data.tmdb_rating) >= parseFloat(tmdb_rating) : true; // Verifica calificación TMDB
            const matchesDirector = directed_by ? data.directed_by === directed_by : true; // Verifica si el director coincide

            if (matchesTitle && matchesSeason && matchesImdb && matchesTmdb && matchesDirector) {
                results.push(data); // Agrega el registro si todos los filtros coinciden
            }
        })
        .on('end', () => {
            res.json(results); // Envía los resultados como respuesta en formato JSON
        })
        .on('error', (err) => {
            console.error(err); // Imprime el error en la consola
            res.status(500).send('Error al buscar registros.'); // Envía un mensaje de error si ocurre un problema
        });
});

// Inicia el servidor y escucha en el puerto definido
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // Mensaje de confirmación en la consola
});
