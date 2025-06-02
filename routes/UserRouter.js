const router = require('express').Router()
const { UserController } = require('../controllers')
const { multer } = require('../middleware')

router.get('/', UserController.getAllUsers)
// router.post('/', multer.single('image'), UserController.createUser)
router.get('/find', UserController.getUserByQuery)
router.get('/:id', UserController.getUserByID)
router.put('/:id', UserController.updateUserByID)
// router.delete('/:id', UserController.deleteUserByID)

module.exports = router