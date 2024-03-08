var express = require('express'),
    router = express.Router();

router
   // Add a binding for '/tests/automated/'
  .get('/bookbyid', function(req,res){
    res.send("Hola mundo libros")
  })

module.exports = router;