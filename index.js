const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

//Crear el servidor de express
const app = express();
//Base de datos
dbConnection();

//CORS
app.use(cors());

//Directorio Publico
app.use( express.static('public') );

//Lectura y parseo del body
app.use( express.json() );

//Rutas
app.use('/auth', require('./routes/auth'));
app.use('/tweet', require('./routes/tweet'));
app.use('/user', require('./routes/user'));

//Escuchar peticions
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
})