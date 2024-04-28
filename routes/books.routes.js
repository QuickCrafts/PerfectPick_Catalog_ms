var express = require('express'),
    router = express.Router();

const bookControllers = require('../controllers/books.controllers');
const asyncErrorMiddleware = require('../middlewares/asyncError.middleware');

router.route("/init").get(asyncErrorMiddleware(bookControllers.initializeBooks));
router.route('/').get(asyncErrorMiddleware(bookControllers.getAllBooks));
router.route("/:id_book").get(asyncErrorMiddleware(bookControllers.getById));
router.route("/").post(asyncErrorMiddleware(bookControllers.createBook));
router.route("/:id_book").put(asyncErrorMiddleware(bookControllers.updateBook));
router.route("/").put(asyncErrorMiddleware(bookControllers.idError));
router.route("/:id_book").delete(asyncErrorMiddleware(bookControllers.deleteBook));
router.route("/").delete(asyncErrorMiddleware(bookControllers.idError));

module.exports = router;