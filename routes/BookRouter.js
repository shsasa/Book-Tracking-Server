
const router = require('express').Router();
const { BookController } = require('../controllers');
const api = require('../api');
const { stripToken, verifyToken } = require('../middleware');

router.get('/', BookController.getAllBooks)
router.get('/search/:search', api.searchBooks) // Search books using Gutendex API
router.get('/:id', api.getBookById) // Get book by ID using Gutendex API
router.get('/url', BookController.getBookUrl);
router.put('/:id/rating/:rating', stripToken, verifyToken, BookController.updateRating); // Update book rating
router.get('/:id/rating/', stripToken, verifyToken, BookController.checkUserRating); // Update book rating
module.exports = router
