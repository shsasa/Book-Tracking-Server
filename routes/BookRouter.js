
const router = require('express').Router();
const { BookController } = require('../controllers');
const api = require('../api');
const { stripToken, verifyToken } = require('../middleware');

router.get('/favorites/', stripToken, verifyToken, BookController.getListOfFavoritesBooks);
router.get('/rated/user', stripToken, verifyToken, BookController.getUserRatedBooks);
router.get('/search/:search', api.searchBooks);
router.get('/url', BookController.getBookUrl);
router.put('/:id/rating/:rating', stripToken, verifyToken, BookController.updateRating);
router.get('/:id/rating/', stripToken, verifyToken, BookController.checkUserRating);
router.post('/:id/favorite', stripToken, verifyToken, BookController.addOrRemoveBookFromFavorites);

router.get('/:id', api.getBookById);
router.get('/', BookController.getAllBooks);
module.exports = router
