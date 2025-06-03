const router = require('express').Router()
const { BookController } = require('../controllers')
const api = require('../api')


router.get('/', BookController.getAllBooks)
router.get('/search', api.searchBooks) // Search books using Gutendex API
router.get('/:id', api.getBookById) // Get book by ID using Gutendex API
module.exports = router