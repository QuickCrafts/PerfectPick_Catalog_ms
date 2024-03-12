const cassandra = require('cassandra-driver');

var express = require('express'),
    router = express.Router({strict:true});

const bookServices = require("../services/books.services")

const client = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_CONTACT_POINTS],
  localDataCenter: process.env.CASSANDRA_LOCAL_DATA_CENTER,
  keyspace: process.env.CASSANDRA_KEYSPACE,
  authProvider: new cassandra.auth.PlainTextAuthProvider(process.env.CASSANDRA_USERNAME, process.env.CASSANDRA_PASSWORD),
});

router.get("/init", bookServices.initializeBooks);
router.get("/", bookServices.getAll);
router.get("/:id_book", bookServices.getById);
router.post("/", bookServices.createBook);
router.put("/:id_book", bookServices.updateBook);
router.put("/", bookServices.idError);
router.delete("/:id_book", bookServices.deleteBook);
router.delete("/", bookServices.idError);

module.exports = router;
