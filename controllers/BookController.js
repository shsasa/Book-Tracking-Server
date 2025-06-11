// controllers/BookController.js
const { Book, BookRating, User, BookFavorite, BookComment, ReadBook } = require('../models');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const isMongoId = (id) => /^[a-f\d]{24}$/i.test(id);



const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).send(books);
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'Error', msg: 'Failed to fetch books.' });
  }
}

const getBookUrl = async (req, res) => {
  try {
    const fileUrl = req.query.url;
    if (!fileUrl) return res.status(400).json({ error: 'Missing file URL' });

    const fileName = path.basename(fileUrl);
    const savePath = path.join(__dirname, '..', 'public', 'epubs', fileName);

    if (fs.existsSync(savePath)) {
      return res.json({ url: `/epubs/${fileName}` });
    }

    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error('Failed to fetch file');

    const buffer = await response.buffer();
    fs.writeFileSync(savePath, buffer);

    res.json({ url: `/epubs/${fileName}` });
  } catch (err) {
    console.error('Book download error:', err.message);
    res.status(500).json({ error: 'Failed to download and save EPUB file' });
  }
};

const updateRating = async (req, res) => {
  try {
    const { id, rating } = req.params;
    const userId = res.locals.payload.id || res.locals.payload._id;
    const numericRating = Number(rating);

    const book = await Book.findOne({ apiId: id });
    const user = await User.findById(userId);

    if (!id || !numericRating) {
      return res.status(400).send({ status: 'Error', msg: 'Book ID and rating are required.' });
    }

    if (!book) {
      return res.status(404).send({ status: 'Error', msg: 'Book not found.' });
    }
    if (!user) {
      return res.status(404).send({ status: 'Error', msg: 'User not found.' });
    }

    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).send({ status: 'Error', msg: 'Invalid rating value. Must be a number between 1 and 5.' });
    }

    let existingRating = await BookRating.findOne({ book: book._id, user: user._id });

    if (existingRating) {
      existingRating.rating = numericRating;
      await existingRating.save();
      return res.status(200).send({ status: 'Success', msg: 'Rating updated.', rating: existingRating });
    } else {
      const newRating = new BookRating({
        book: book._id,
        user: user._id,
        rating: numericRating
      });
      await newRating.save();
      return res.status(201).send({ status: 'Success', msg: 'Rating created.', rating: newRating });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'Error', msg: 'Failed to update rating.' });
  }
};
const checkUserRating = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findOne({ apiId: bookId });
    const userId = res.locals.payload?.id || res.locals.payload?._id;

    if (!book) {
      return res.status(404).send({ status: 'Error', msg: 'Book not found.' });
    }
    if (!userId) {
      return res.status(401).send({ status: 'Error', msg: 'User not authorized.' });
    }

    const rating = await BookRating.findOne({ book: book._id, user: userId });
    if (!rating) {
      return res.status(404).send({ status: 'Error', msg: 'No rating found for this user and book.' });
    }
    return res.status(200).send({ status: 'Success', rating });
  } catch (error) {
    console.error('Check user rating error:', error);
    res.status(500).send({ status: 'Error', msg: 'Failed to check user rating' });
  }
};

const getUserRatedBooks = async (req, res) => {
  try {
    const userId = res.locals.payload?.id || res.locals.payload?._id;
    if (!userId) {
      return res.status(401).send({ status: 'Error', msg: 'User not authorized.' });
    }

    const ratings = await BookRating.find({ user: userId }).populate('book');
    const books = ratings.map(rating => rating.book);

    res.status(200).send({ status: 'Success', books });
  } catch (error) {
    console.error('Get user rated books error:', error);
    res.status(500).send({ status: 'Error', msg: 'Failed to get user rated books.' });
  }
};



const addOrRemoveBookFromFavorites = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = res.locals.payload?.id || res.locals.payload?._id;

    if (!bookId || !userId) {
      return res.status(400).send({ status: 'Error', msg: 'Book ID and user ID are required.' });
    }

    const book = await Book.findOne({ apiId: bookId });
    if (!book) {
      return res.status(404).send({ status: 'Error', msg: 'Book not found.' });
    }

    const existingFavorite = await BookFavorite.findOne({ book: book._id, user: userId });

    if (existingFavorite) {
      await BookFavorite.deleteOne({ _id: existingFavorite._id });
      return res.status(200).send({ status: 'Success', msg: 'Book removed from favorites.' });
    } else {
      const newFavorite = new BookFavorite({ book: book._id, user: userId });
      await newFavorite.save();
      return res.status(200).send({ status: 'Success', msg: 'Book added to favorites.' });
    }
  } catch (error) {
    console.error('Add/Remove book from favorites error:', error);
    res.status(500).send({ status: 'Error', msg: 'Failed to add/remove book from favorites.' });
  }
};

const getListOfFavoritesBooks = async (req, res) => {
  try {
    const userId = res.locals.payload?.id || res.locals.payload?._id;
    console.log('User ID:', userId);
    if (!userId) {
      return res.status(401).send({ status: 'Error', msg: 'User not authorized.' });
    }

    const favorites = await BookFavorite.find({ user: userId }).populate('book');

    console.log('Favorites:', favorites);
    const books = favorites.map(fav => fav.book);



    res.status(200).send({ status: 'Success', books });
  } catch (error) {
    console.error('Get list of favorite books error:', error);
    res.status(500).send({ status: 'Error', msg: 'Failed to get list of favorite books.' });
  }
};

const postComment = async (req, res) => {
  try {
    const { bookId, comment } = req.body;
    const userId = res.locals.payload?.id || res.locals.payload?._id;

    if (!bookId || !comment || !userId
      || !comment.trim()) {
      return res.status(400).send({ status: 'Error', msg: 'Book ID, comment, and user ID are required.' });
    }

    const book = await Book.findOne({ apiId: bookId });
    if (!book) {
      return res.status(404).send({ status: 'Error', msg: 'Book not found.' });
    }

    const newComment = new BookComment({
      book: book._id,
      user: userId,
      comment
    });

    await newComment.save();
    res.status(201).send({ status: 'Success', msg: 'Comment added successfully.', comment: newComment });
  } catch (error) {
    console.error('Post comment error:', error);
    res.status(500).send({ status: 'Error', msg: 'Failed to post comment.' });
  }
};


const addBookToReadList = async (req, res) => {
  try {
    const userId = res.locals.payload?.id || res.locals.payload?._id;
    const { bookId } = req.body;

    if (!userId || !bookId) {
      return res.status(400).send({ status: 'Error', msg: 'User ID and Book ID are required.' });
    }

    let book;
    if (isMongoId(bookId)) {
      book = await Book.findById(bookId);
    } else {
      book = await Book.findOne({ apiId: bookId });
    }

    if (!book) {
      return res.status(404).send({ status: 'Error', msg: 'Book not found.' });
    }

    let readBook = await ReadBook.findOne({ user: userId, book: book._id });
    if (readBook) {
      return res.status(200).send({ status: 'Success', msg: 'Book already in your reading list.', readBook });
    }

    readBook = new ReadBook({
      user: userId,
      book: book._id,
      status: 'not_started',
      currentPage: null
    });
    await readBook.save();

    res.status(201).send({ status: 'Success', msg: 'Book added to your reading list.', readBook });
  } catch (error) {
    console.error('Add book to read list error:', error);
    res.status(500).send({ status: 'Error', msg: 'Failed to add book to reading list.' });
  }
};
const updateReadBook = async (req, res) => {
  try {
    const userId = res.locals.payload?.id || res.locals.payload?._id;
    const { bookId } = req.params;
    const { status, currentPage } = req.body;

    if (!userId || !bookId) {
      return res.status(400).send({ status: 'Error', msg: 'User ID and Book ID are required.' });
    }

    let book;
    if (isMongoId(bookId)) {
      book = await Book.findById(bookId);
    } else {
      book = await Book.findOne({ apiId: bookId });
    }

    if (!book) {
      return res.status(404).send({ status: 'Error', msg: 'Book not found.' });
    }

    let readBook = await ReadBook.findOne({ user: userId, book: book._id });
    if (!readBook) {
      return res.status(404).send({ status: 'Error', msg: 'Book not found in your reading list.' });
    }

    if (status) readBook.status = status;
    if (typeof currentPage === 'number') readBook.currentPage = currentPage;

    await readBook.save();

    res.status(200).send({ status: 'Success', msg: 'Reading status updated.', readBook });
  } catch (error) {
    console.error('Update read book error:', error);
    res.status(500).send({ status: 'Error', msg: 'Failed to update reading status.' });
  }
};
const removeBookFromReadList = async (req, res) => {
  try {
    const userId = res.locals.payload?.id || res.locals.payload?._id;
    const { bookId } = req.params;

    if (!userId || !bookId) {
      return res.status(400).send({ status: 'Error', msg: 'User ID and Book ID are required.' });
    }

    let book;
    if (isMongoId(bookId)) {
      book = await Book.findById(bookId);
    } else {
      book = await Book.findOne({ apiId: bookId });
    }

    if (!book) {
      return res.status(404).send({ status: 'Error', msg: 'Book not found.' });
    }

    const deleted = await ReadBook.findOneAndDelete({ user: userId, book: book._id });
    if (!deleted) {
      return res.status(404).send({ status: 'Error', msg: 'Book not found in your reading list.' });
    }

    res.status(200).send({ status: 'Success', msg: 'Book removed from your reading list.' });
  } catch (error) {
    console.error('Remove book from read list error:', error);
    res.status(500).send({ status: 'Error', msg: 'Failed to remove book from reading list.' });
  }
};

const getUserReadList = async (req, res) => {
  try {
    const userId = res.locals.payload?.id || res.locals.payload?._id;
    if (!userId) {
      return res.status(401).send({ status: 'Error', msg: 'User not authorized.' });
    }

    const readBooks = await ReadBook.find({ user: userId }).populate('book');
    const books = readBooks
      .filter(entry => entry.book)
      .map(entry => ({
        ...entry.book.toObject(),
        status: entry.status,
        currentPage: entry.currentPage
      }));

    res.status(200).send({ status: 'Success', books });
  } catch (error) {
    console.error('Get user read list error:', error);
    res.status(500).send({ status: 'Error', msg: 'Failed to get user read list.' });
  }
};



module.exports = {
  getAllBooks,
  updateRating,
  getBookUrl,
  checkUserRating,
  getUserRatedBooks,
  addOrRemoveBookFromFavorites,
  getListOfFavoritesBooks,
  postComment,
  addBookToReadList,
  updateReadBook,
  removeBookFromReadList,
  getUserReadList

};