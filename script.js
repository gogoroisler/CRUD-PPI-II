// Obtiene elementos del DOM
const recordForm = document.getElementById('recordForm'); // Formulario para agregar registros
const recordList = document.getElementById('recordList'); // Lista donde se mostrarán los registros
const messageDiv = document.getElementById('message'); // Div para mostrar mensajes
const filterDirector = document.getElementById('filterDirector'); // Select para filtrar por director
let editMode = false; // Indica si estamos en modo edición
let editId = null; // Almacena el ID del registro que se está editando
let recordsCache = []; // Cache para almacenar los registros obtenidos de la API

// Función para poblar el select de directores
const populateDirectors = (records) => {
    filterDirector.innerHTML = ''; // Limpia las opciones del select
    const directors = [...new Set(records.map(record => record.directed_by))]; // Obtiene un array con directores únicos
    // Crea un option por cada director único y lo agrega al select
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = "Seleccionar Director";
    filterDirector.appendChild(defaultOption);
    directors.forEach(director => {
        const option = document.createElement('option');
        option.value = director; // Valor del option
        option.textContent = director; // Texto visible del option
        filterDirector.appendChild(option); // Añade el option al select
    });

};

// Cargar datos desde la API
const fetchData = async () => {
    const response = await fetch('http://localhost:3000/api/data'); // Realiza la petición a la API
    recordsCache = await response.json(); // Convierte la respuesta a formato JSON y almacena en recordsCache
    populateDirectors(recordsCache); // Llama a la función para poblar el select de directores
};

// Evento para manejar el envío del formulario
recordForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita el envío normal del formulario

    const newRecord = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        original_air_date: document.getElementById('original_air_date').value,
        directed_by: document.getElementById('directed_by').value,
        written_by: document.getElementById('written_by').value,
        season: parseInt(document.getElementById('season').value),
        number_in_season: parseInt(document.getElementById('number_in_season').value),
        number_in_series: parseInt(document.getElementById('number_in_series').value),
        us_viewers_in_millions: parseFloat(document.getElementById('us_viewers_in_millions').value),
        imdb_rating: parseFloat(document.getElementById('imdb_rating').value),
        tmdb_rating: parseFloat(document.getElementById('tmdb_rating').value),
    };

    const action = editMode ? 'modificar' : 'agregar';
    if (!confirm(`¿Estás seguro de que deseas ${action} el registro?`)) {
        return; // Cancelar la acción
    }

    try {
        const response = await fetch(editMode ? `http://localhost:3000/api/data/${editId}` : 'http://localhost:3000/api/data', {
            method: editMode ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRecord), // Convierte el nuevo registro a JSON
        });

        if (!response.ok) throw new Error('Error al guardar el registro');

        const result = await response.json();
        messageDiv.textContent = result.message; // Muestra el mensaje de éxito
        messageDiv.style.color = 'green';

        // Limpiar el formulario después de agregar o editar el registro
        recordForm.reset();
        editMode = false; // Restablece el modo de edición
        editId = null; // Restablece el ID de edición

        // Volver a cargar los datos para mostrar el nuevo registro
        await fetchData();

    } catch (error) {
        messageDiv.textContent = `Error: ${error.message}`;
        messageDiv.style.color = 'red';
    }
});

// Modificar el evento para eliminar un registro
const deleteRecord = async (id, listItem) => {
    if (!confirm('¿Estás seguro de que deseas eliminar el registro?')) {
        return; // Cancelar la acción
    }

    try {
        const response = await fetch(`http://localhost:3000/api/data/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Error al eliminar el registro');

        // Elimina el elemento de la lista de la interfaz
        listItem.remove();

        messageDiv.textContent = 'Registro eliminado correctamente.'; // Mensaje de éxito
        messageDiv.style.color = 'green';

    } catch (error) {
        messageDiv.textContent = `Error: ${error.message}`;
        messageDiv.style.color = 'red';
    }
};

// Mostrar registros en la lista
const displayRecords = (data) => {
    recordList.innerHTML = ''; // Limpia la lista de registros
    if (data.length === 0) {
        const noRecordsMessage = document.createElement('li');
        noRecordsMessage.textContent = 'No hay registros para mostrar.';
        recordList.appendChild(noRecordsMessage);
        return;
    }
    data.forEach(record => {
        const li = document.createElement('li');
        li.textContent = `${record.title} - ${record.description} (Temporada ${record.season}, Episodio ${record.number_in_season})`;
        li.dataset.id = record.id;

        // Botón para editar el registro
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.onclick = () => editRecord(record);
        li.appendChild(editButton);

        // Botón para eliminar el registro
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.onclick = () => deleteRecord(record.id, li);
        li.appendChild(deleteButton);

        recordList.appendChild(li);
    });
};

// Mensaje para indicar que se están mostrando todos los registros
const showAllMessage = document.createElement('div');
showAllMessage.id = 'showAllMessage'; // ID para poder acceder al mensaje
showAllMessage.textContent = 'Mostrando todos los registros.'; // Texto del mensaje
document.body.insertBefore(showAllMessage, recordList); // Inserta el mensaje antes de la lista
showAllMessage.style.display = 'none'; // Oculta el mensaje por defecto

// Evento para mostrar todos los registros al hacer clic
document.getElementById('showAllButton').addEventListener('click', () => {
    displayRecords(recordsCache); // Muestra todos los registros almacenados
    showAllMessage.style.display = 'block'; // Muestra el mensaje
});

// Evento para buscar registros al hacer clic
document.getElementById('searchButton').addEventListener('click', () => {
    searchRecords(); // Llama a la función para buscar registros
});

// Función para buscar registros
const searchRecords = () => {
    // Obtiene los valores de los filtros de búsqueda
    const searchTerm = document.getElementById('filterTitle').value.toLowerCase();
    const filterSeason = document.getElementById('filterSeason').value;
    const filterImdb = document.getElementById('filterImdb').value;
    const filterTmdb = document.getElementById('filterTmdb').value;
    const filterDirectorValue = filterDirector.value; // Valor del director seleccionado

    // Filtra los registros según los criterios de búsqueda
    const filteredRecords = recordsCache.filter(record => {
        const matchesTitle = searchTerm ? record.title.toLowerCase().includes(searchTerm) : true; // Coincidencia en el título
        const matchesSeason = filterSeason ? record.season == parseInt(filterSeason) : true; // Coincidencia en la temporada
        const matchesImdb = filterImdb ? record.imdb_rating >= parseFloat(filterImdb) : true; // Coincidencia en calificación IMDB
        const matchesTmdb = filterTmdb ? record.tmdb_rating >= parseFloat(filterTmdb) : true; // Coincidencia en calificación TMDB
        const matchesDirector = filterDirectorValue ? record.directed_by === filterDirectorValue : true; // Coincidencia en el director (opcional)

        // Retorna verdadero solo si todos los filtros coinciden
        return matchesTitle && matchesSeason && matchesImdb && matchesTmdb && matchesDirector;
    });

    // Muestra u oculta el mensaje dependiendo de si hay resultados
    if (filteredRecords.length === 0) {
        showAllMessage.style.display = 'none'; // Oculta el mensaje si no hay resultados
    } else {
        showAllMessage.style.display = 'block'; // Muestra el mensaje si hay resultados
    }

    displayRecords(filteredRecords); // Muestra los registros filtrados
};

// Función para editar un registro
const editRecord = (record) => {
    editMode = true; // Activar modo edición
    editId = record.id; // Guardar el ID del registro que se está editando

    // Llenar el formulario con los datos del registro
    document.getElementById('title').value = record.title;
    document.getElementById('description').value = record.description;
    document.getElementById('original_air_date').value = record.original_air_date;
    document.getElementById('directed_by').value = record.directed_by;
    document.getElementById('written_by').value = record.written_by;
    document.getElementById('season').value = record.season;
    document.getElementById('number_in_season').value = record.number_in_season;
    document.getElementById('number_in_series').value = record.number_in_series;
    document.getElementById('us_viewers_in_millions').value = record.us_viewers_in_millions;
    document.getElementById('imdb_rating').value = record.imdb_rating;
    document.getElementById('tmdb_rating').value = record.tmdb_rating;
};

// Evento para manejar el envío del formulario
recordForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita el envío normal del formulario

    const newRecord = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        original_air_date: document.getElementById('original_air_date').value,
        directed_by: document.getElementById('directed_by').value,
        written_by: document.getElementById('written_by').value,
        season: parseInt(document.getElementById('season').value),
        number_in_season: parseInt(document.getElementById('number_in_season').value),
        number_in_series: parseInt(document.getElementById('number_in_series').value),
        us_viewers_in_millions: parseFloat(document.getElementById('us_viewers_in_millions').value),
        imdb_rating: parseFloat(document.getElementById('imdb_rating').value),
        tmdb_rating: parseFloat(document.getElementById('tmdb_rating').value),
    };

    const action = editMode ? 'modificar' : 'agregar';
    if (!confirm(`¿Estás seguro de que deseas ${action} el registro?`)) {
        return; // Cancelar la acción
    }

    try {
        const response = await fetch(editMode ? `http://localhost:3000/api/data/${editId}` : 'http://localhost:3000/api/data', {
            method: editMode ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRecord), // Convierte el nuevo registro a JSON
        });

        if (!response.ok) throw new Error('Error al guardar el registro');

        const result = await response.json();
        messageDiv.textContent = result.message; // Muestra el mensaje de éxito
        messageDiv.style.color = 'green';

        // Limpiar el formulario después de agregar o editar el registro
        recordForm.reset();
        editMode = false; // Restablece el modo de edición
        editId = null; // Restablece el ID de edición

        // Volver a cargar los datos para mostrar el nuevo registro
        await fetchData();

    } catch (error) {
        messageDiv.textContent = `Error: ${error.message}`;
        messageDiv.style.color = 'red';
    }
});

// Llamar a fetchData al cargar la página
fetchData(); // Carga los datos inicialmente

