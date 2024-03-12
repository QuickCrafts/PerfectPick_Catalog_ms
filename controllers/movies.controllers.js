// const movieServices = require("../services/movies.services")

// class MovieController {
//     async getAll(req, res){
//         try{
//             const result =  await movieServices.getAll()
      
//             if (result.rowLength > 0) {
//               res.status(200).json(result.rows);
//             } else {
//               res.status(404).send(`No existen películas en la base de datos.`);
//             }
      
//         }catch (error){
//             console.error(error);
//             res.status(500).send('Error al intentar mostrar las películas.');
//         }
//     }
// }

// module.exports = new MovieController();