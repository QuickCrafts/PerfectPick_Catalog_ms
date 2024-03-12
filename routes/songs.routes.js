const cassandra = require('cassandra-driver');

var express = require('express'),
    router = express.Router();

const songServices = require("../services/songs.services")

const client = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_CONTACT_POINTS],
  localDataCenter: process.env.CASSANDRA_LOCAL_DATA_CENTER,
  keyspace: process.env.CASSANDRA_KEYSPACE,
  authProvider: new cassandra.auth.PlainTextAuthProvider(process.env.CASSANDRA_USERNAME, process.env.CASSANDRA_PASSWORD),
});

router.get("/init", songServices.initializeSongs);
router.get('/', songServices.getAll);
router.get("/:id_song", songServices.getById);
router.post("/", songServices.createSong);
router.put("/:id_song", songServices.updateSong);
router.put("/", songServices.idError);
router.delete("/:id_song", songServices.deleteSong);
router.delete("/", songServices.idError);

module.exports = router;