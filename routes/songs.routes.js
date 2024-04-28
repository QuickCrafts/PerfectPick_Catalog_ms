var express = require('express'),
    router = express.Router();

const songControllers = require('../controllers/songs.controllers');
const asyncErrorMiddleware = require('../middlewares/asyncError.middleware');

router.route("/init").get(asyncErrorMiddleware(songControllers.initializeSongs));
router.route('/').get(asyncErrorMiddleware(songControllers.getAllSongs));
router.route("/:id_song").get(asyncErrorMiddleware(songControllers.getById));
router.route("/").post(asyncErrorMiddleware(songControllers.createSong));
router.route("/:id_song").put(asyncErrorMiddleware(songControllers.updateSong));
router.route("/").put(asyncErrorMiddleware(songControllers.idError));
router.route("/:id_song").delete(asyncErrorMiddleware(songControllers.deleteSong));
router.route("/").delete(asyncErrorMiddleware(songControllers.idError));

module.exports = router;