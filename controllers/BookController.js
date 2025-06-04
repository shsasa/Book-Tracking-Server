// controllers/BookController.js
const { Book } = require('../models');

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).send(books);
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'Error', msg: 'Failed to fetch books.' });
  }
};

const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const book = await Book.findByIdAndUpdate(id, { rating }, { new: true });
    if (!book) {
      return res.status(404).send({ status: 'Error', msg: 'Book not found' });
    }
    res.status(200).send(book);
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'Error', msg: 'Failed to update rating.' });
  }
};

module.exports = {
  getAllBooks,
  updateRating,
};