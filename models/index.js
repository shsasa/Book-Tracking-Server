const mongoose = require('mongoose')
const userSchema = require('./User')

const User = mongoose.model('User', userSchema)
const Book = mongoose.model('Book', userSchema)

module.exports = {
  User,
  Book
}
