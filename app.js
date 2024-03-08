const express = require('express');
const cassandra = require('cassandra-driver');

const app = express();
const port = 3000;

var moviesRoutes = require('./routes/movies.routes');
var songsRoutes = require('./routes/songs.routes');
var booksRoutes = require('./routes/books.routes');
// var mediaRoutes = require('./routes/movies.routes');


// Conexión a Cassandra
const client = new cassandra.Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1',
  keyspace: 'perfectpick_catalog_db',
});

// Ruta de ejemplo que consulta datos de Cassandra
app.get('/prueba', async (req, res) => {
   paramMovie =  await client.execute("SELECT * FROM movies;")
   paramSong =  await client.execute("SELECT * FROM songs;")
   paramBook =  await client.execute("SELECT * FROM books;")
   // paramMedia =  await client.execute("SELECT * FROM media;")

  res.json(paramMovie.rows[0])
  res.json(paramSong.rows[0])
  res.json(paramBook.rows[0])
  // res.json(paramMedia.rows[0])
});

// Inicio del servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});

app.use('/movies', moviesRoutes);
app.use('/songs', songsRoutes);
app.use('/books', booksRoutes);
// app.use('/media', mediaRoutes);