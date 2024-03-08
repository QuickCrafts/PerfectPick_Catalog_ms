var express = require('express'),
    router = express.Router();

router
   // Add a binding for '/tests/automated/'
  .get('/mediabyid', function(req,res){
    res.send("Hola mundo media")
  })

module.exports = router;