const mongoose = require('mongoose');

const userSchema = require('./User');
const bookSchema = require('./Book');
const authorSchema = require('./Author');
const bookRatingSchema = require('./BookRatings');
const bookFavoriteSchema = require('./BookFavorite');
const bookComment = require('./BookComments');
const readBookSchema = require('./ReadBooks');

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);
const Author = mongoose.models.Author || mongoose.model('Author', authorSchema);
const BookRating = mongoose.models.BookRating || mongoose.model('BookRating', bookRatingSchema);
const BookFavorite = mongoose.models.BookFavorite || mongoose.model('BookFavorite', bookFavoriteSchema);
const BookComment = mongoose.models.BookComment || mongoose.model('BookComment', bookComment);
const ReadBook = mongoose.models.ReadBook || mongoose.model('ReadBook', readBookSchema);

module.exports = {
  User,
  Book,
  Author,
  BookRating,
  BookFavorite,
  BookComment,
  ReadBook
};
