const mongoose = require('mongoose');

const userSchema = require('./User');
const bookSchema = require('./Book');
const authorSchema = require('./Author');

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);
const Author = mongoose.models.Author || mongoose.model('Author', authorSchema);

module.exports = {
  User,
  Book,
  Author
};
