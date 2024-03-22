const express = require('express');
const cassandra = require('cassandra-driver');
require('dotenv').config();

const errorMiddleware = require("./middlewares/error.middleware");

const app = express();
const port = process.env.PORT;

var moviesRoutes = require('./routes/movies.routes');
var songsRoutes = require('./routes/songs.routes');
var booksRoutes = require('./routes/books.routes');


// Conexión a Cassandra
const client = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_CONTACT_POINTS],
  localDataCenter: process.env.CASSANDRA_LOCAL_DATA_CENTER,
  keyspace: process.env.CASSANDRA_KEYSPACE,
  authProvider: new cassandra.auth.PlainTextAuthProvider(process.env.CASSANDRA_USERNAME, process.env.CASSANDRA_PASSWORD),
});


client.connect(function(err, result){
  console.log('app: cassandra connected');
});

// Inicio del servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});

app.use(express.json());
app.use('/movies', moviesRoutes);
app.use('/songs', songsRoutes);
app.use('/books', booksRoutes);
app.use(errorMiddleware);