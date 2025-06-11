// controllers/BookController.js
const { Book, BookRating, User } = require('../models');
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

module.exports = {
  getAllBooks,
  updateRating,
  getBookUrl,
  checkUserRating
};