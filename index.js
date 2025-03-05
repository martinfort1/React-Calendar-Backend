const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config');
const cors = require('cors');
const path = require('path');

//Crear el servidor de express
const app =  express();
//Base de Datos
dbConnection();

// CORS 
const corsOptions = {
    origin: '*',  // Permite cualquier origen 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization,x-token'
};
app.use(cors( corsOptions))

//Directorio Público
app.use( express.static( path.join(__dirname, 'public')));

//Asegurar MIME type de archivos .js y .css en la carpeta assets
app.use( '/assets', express.static(path.join(__dirname, 'public', 'assets'),{
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
        else if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

//Lectura y parseo del body
app.use( express.json() );

//Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

//Manejar otras rutas
app.get('*', (req,res) => { 
    res.sendFile( path.join( __dirname,  '/public/index.html') );
} );

// Escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto: ${ process.env.PORT }` )
})
