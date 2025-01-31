# CRUD-PPI-II
WIP: CRUD Trabajo Practico

# Documentación del Proyecto: CRUD de Series

## Introducción

Este proyecto es una aplicación web simple que permite gestionar registros de series de televisión. Incluye funcionalidades para crear, leer, actualizar y eliminar registros (CRUD) utilizando una API construida con Node.js y Express, junto con un frontend en HTML, CSS y JavaScript. 

La aplicación permite a los usuarios agregar información sobre series, filtrar registros por título, temporada, calificaciones y director, y ver una lista de todas las series registradas.

## Requisitos Previos

Antes de ejecutar la aplicación, asegúrate de tener instalado lo siguiente:

1. **Node.js**: Necesitas tener instalado Node.js en tu sistema. Puedes descargarlo desde [aquí](https://nodejs.org/).
2. **npm (Node Package Manager)**: Normalmente se instala junto con Node.js.

## Instalación

Sigue estos pasos para instalar y ejecutar el proyecto:

1. **Clonar el Repositorio**:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_DIRECTORIO>
   ```

2. **Instalar Dependencias**:
   Navega a la carpeta del servidor y ejecuta el siguiente comando:
   ```bash
   npm install
   ```
   Esto instalará las dependencias necesarias, incluyendo `express`, `csv-parser`, `json2csv`, `cors`, y `body-parser`.

3. **Crear el Archivo CSV**:
   Crea un archivo llamado `data.csv` en la misma carpeta que `server.js`. Este archivo servirá como la base de datos para almacenar los registros de las series.

4. **Ejecutar el Servidor**:
   Inicia el servidor con el siguiente comando:
   ```bash
   node server.js
   ```
   Esto levantará el servidor en `http://localhost:3000`.

5. **Abrir la Aplicación en el Navegador**:
   Abre el archivo `index.html` en tu navegador. La aplicación debería estar funcionando y lista para ser utilizada.

## Estructura del Proyecto

El proyecto se compone de los siguientes archivos principales:

### 1. `server.js`
Este archivo contiene la configuración del servidor y las rutas de la API. Proporciona los endpoints para manejar operaciones CRUD y filtrado de registros.

### 2. `script.js`
Este archivo contiene la lógica del frontend para interactuar con la API. Se encarga de cargar los registros, mostrar y filtrar datos, y manejar eventos del usuario como la adición y eliminación de registros.

### 3. `index.html`
Este archivo define la estructura básica de la interfaz de usuario. Incluye un formulario para agregar nuevos registros, botones para buscar y mostrar todos los registros, y una lista para mostrar los datos almacenados.

### 4. `styles.css`
Este archivo contiene los estilos CSS que dan formato y diseño a la aplicación. Define la apariencia de los formularios, botones, listas y mensajes en la interfaz de usuario.

## Funcionalidades

1. **Agregar Registro**: Permite al usuario ingresar datos de una nueva serie y guardarla en el archivo CSV.
2. **Mostrar Registros**: Muestra una lista de todas las series registradas.
3. **Buscar Registros**: Filtra los registros según el título, temporada, calificaciones de IMDB y TMDB, y director.
4. **Editar Registro**: Permite al usuario modificar la información de una serie existente.
5. **Eliminar Registro**: Permite al usuario eliminar un registro de la lista.

## Conclusión

Esta aplicación es un ejemplo básico de cómo construir una aplicación web utilizando Node.js y Express para el backend y HTML, CSS, y JavaScript para el frontend. Es extensible y puede mejorarse añadiendo más características, como autenticación de usuarios, validaciones más robustas y una base de datos real.

Para cualquier pregunta o sugerencia sobre el proyecto, no dudes en contactar al autor.
