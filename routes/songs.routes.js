var express = require('express'),
    router = express.Router();

router
   // Add a binding for '/tests/automated/'
  .get('/songbyid', function(req,res){
    res.send("Hola mundo canciones")
  })

module.exports = router;