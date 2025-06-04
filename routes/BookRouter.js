
const router = require('express').Router();
const { BookController } = require('../controllers');
const api = require('../api');

router.get('/', BookController.getAllBooks);
router.get('/search/:search', api.searchBooks); 
router.get('/:id', api.getBookById);
router.put('/:id/rating', BookController.updateRating); // New route to update rating

module.exports = router;