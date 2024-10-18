// Obtiene elementos del DOM
const recordForm = document.getElementById('recordForm'); // Formulario para agregar registros
const recordList = document.getElementById('recordList'); // Lista donde se mostrarán los registros
const messageDiv = document.getElementById('message'); // Div para mostrar mensajes
const filterDirector = document.getElementById('filterDirector'); // Select para filtrar por director
let editMode = false; // Indica si estamos en modo edición
let editId = null; // Almacena el ID del registro que se está editando
let recordsCache = []; // Cache para almacenar los registros obtenidos de la API

// Cargar datos desde la API
const fetchData = async () => {
    const response = await fetch('http://localhost:3000/api/data'); // Realiza la petición a la API
    recordsCache = await response.json(); // Convierte la respuesta a formato JSON y almacena en recordsCache
    populateDirectors(recordsCache); // Llama a la función para poblar el select de directores
};

// Función para poblar el select de directores
const populateDirectors = (records) => {
    // Obtiene un array con directores únicos
    const directors = [...new Set(records.map(record => record.directed_by))]; 
    // Crea un option por cada director único y lo agrega al select
    directors.forEach(director => {
        const option = document.createElement('option');
        option.value = director; // Valor del option
        option.textContent = director; // Texto visible del option
        filterDirector.appendChild(option); // Añade el option al select
    });
};

// Mostrar registros en la lista
const displayRecords = (data) => {
    recordList.innerHTML = ''; // Limpia la lista de registros
    if (data.length === 0) {
        // Si no hay registros, muestra un mensaje
        const noRecordsMessage = document.createElement('li');
        noRecordsMessage.textContent = 'No hay registros para mostrar.';
        recordList.appendChild(noRecordsMessage); // Añade el mensaje a la lista
        return;
    }
    // Itera sobre los registros y los muestra en la lista
    data.forEach(record => {
        const li = document.createElement('li');
        li.textContent = `${record.title} - ${record.description} (Temporada ${record.season}, Episodio ${record.number_in_season})`;
        li.dataset.id = record.id; // Almacena el ID del registro

        // Botón para editar el registro
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar'; // Texto del botón
        editButton.onclick = () => editRecord(record); // Asigna función para editar
        li.appendChild(editButton); // Añade el botón a la lista

        // Botón para eliminar el registro
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar'; // Texto del botón
        deleteButton.onclick = () => deleteRecord(record.id); // Asigna función para eliminar
        li.appendChild(deleteButton); // Añade el botón a la lista

        recordList.appendChild(li); // Añade el elemento de la lista al contenedor
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
        const matchesDirector = filterDirectorValue ? record.directed_by === filterDirectorValue : true; // Coincidencia en el director

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

// Llamar a fetchData al cargar la página
fetchData(); // Carga los datos inicialmente
