const mongoose = require('mongoose')
const userSchema = require('./User')
const bookSchema = require('./Book')
const authorSchema = require('./Author')
const Book = mongoose.model('Book', bookSchema)
const Author = mongoose.model('Author', authorSchema)

const User = mongoose.model('User', userSchema)

module.exports = {
  User,
  Book,
  Author
}
