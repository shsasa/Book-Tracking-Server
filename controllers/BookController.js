const router = require('express').Router();
const Book = require('../models/Book');




const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).send(books);
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'Error', msg: 'Failed to fetch books.' });
  }
}

module.exports = {
  getAllBooks,
};





