const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config');
const cors = require('cors');

//Crear el servidor de express
const app =  express();
//Base de Datos
dbConnection();

// CORS 
app.use(cors())

//Directorio Público
app.use( express.static('public')); //middleware  función que se ejecuta en el momento que alguien hace una peticion a mi servidor
//Lectura y parseo del body
app.use( express.json() );


//Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
// TODO: auth // crear, login, renew

// TODO: CRUD: Eventos


// Escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto: ${ process.env.PORT }` )
})
