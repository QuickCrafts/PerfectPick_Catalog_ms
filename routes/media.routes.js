const cassandra = require('cassandra-driver');

var express = require('express'),
    router = express.Router();

const client = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_CONTACT_POINTS],
  localDataCenter: process.env.CASSANDRA_LOCAL_DATA_CENTER,
  keyspace: process.env.CASSANDRA_KEYSPACE,
  authProvider: new cassandra.auth.PlainTextAuthProvider(process.env.CASSANDRA_USERNAME, process.env.CASSANDRA_PASSWORD),
});

router
  .get('/', async function(req,res){
    // paramMedia =  await client.execute("SELECT * FROM media;")
    // res.json(paramMedia.rows)
    
    res.send("Hola mundo media")
  })


module.exports = router;