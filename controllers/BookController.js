// controllers/BookController.js
const { Book, BookRating, User, BookFavorite } = require('../models');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');




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


module.exports = {
  getAllBooks,
  updateRating,
  getBookUrl,
  checkUserRating,
  getUserRatedBooks,
  addOrRemoveBookFromFavorites,
  getListOfFavoritesBooks

};