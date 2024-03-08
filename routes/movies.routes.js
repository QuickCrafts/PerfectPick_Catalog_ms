var express = require('express'),
    router = express.Router();

router
   // Add a binding for '/tests/automated/'
  .get('/moviebyid', function(req,res){
    res.send("Hola mundo películas")
  })

module.exports = router;