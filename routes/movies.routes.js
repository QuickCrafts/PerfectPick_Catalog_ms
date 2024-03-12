const cassandra = require('cassandra-driver');

var express = require('express'),
    router = express.Router();

const movieServices = require("../services/movies.services")

const client = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_CONTACT_POINTS],
  localDataCenter: process.env.CASSANDRA_LOCAL_DATA_CENTER,
  keyspace: process.env.CASSANDRA_KEYSPACE,
  authProvider: new cassandra.auth.PlainTextAuthProvider(process.env.CASSANDRA_USERNAME, process.env.CASSANDRA_PASSWORD),
});

router.get("/init", movieServices.initializeMovies);
router.get('/', movieServices.getAll);
router.get("/:id_movie", movieServices.getById);
router.post("/", movieServices.createMovie);
router.put("/:id_movie", movieServices.updateMovie);
router.put("/", movieServices.idError);
router.delete("/:id_movie", movieServices.deleteMovie);
router.delete("/", movieServices.idError);


module.exports = router;