const router = require('express').Router()
const { BookController } = require('../controllers')
const api = require('../api')


router.get('/', BookController.getAllBooks)
router.get('/search/:search', api.searchBooks) // Search books using Gutendex API
router.get('/:id', api.getBookById) // Get book by ID using Gutendex API
router.get('/url', BookController.getBookUrl);
module.exports = router