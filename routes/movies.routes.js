var express = require('express'),
    router = express.Router();

const movieControllers = require('../controllers/movies.controllers');
const asyncErrorMiddleware = require('../middlewares/asyncError.middleware');

router.route("/init").get(asyncErrorMiddleware(movieControllers.initializeMovies));
router.route('/').get(asyncErrorMiddleware(movieControllers.getAllMovies));
router.route("/:id_movie").get(asyncErrorMiddleware(movieControllers.getById));
router.route("/").post(asyncErrorMiddleware(movieControllers.createMovie));
router.route("/:id_movie").put(asyncErrorMiddleware(movieControllers.updateMovie));
router.route("/").put(asyncErrorMiddleware(movieControllers.idError));
router.route("/:id_movie").delete(asyncErrorMiddleware(movieControllers.deleteMovie));
router.route("/").delete(asyncErrorMiddleware(movieControllers.idError));


module.exports = router;