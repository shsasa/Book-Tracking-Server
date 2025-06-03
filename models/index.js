const mongoose = require('mongoose')
const userSchema = require('./User')
const bookSchema = require('./Book')

const User = mongoose.model('User', userSchema)
const Book = mongoose.model('Book', bookSchema)

module.exports = {
  User,
  Book


}
