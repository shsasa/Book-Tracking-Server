const express = require('express');
const axios = require('axios');
const Book = require('../models/Book'); // Assuming you have a Book model defined

// Base URL for Gutendex API
const GUTENDEX_BASE_URL = 'https://gutendex.com/books';


// Search books


const searchBooks = async (req, res) => {
  try {
    const response = await axios.get(GUTENDEX_BASE_URL, {
      params: { search: req.params.search }
    });
    res.send(response.data)
  } catch (error) {
    throw new Error('Failed to fetch books from Gutendex.');
  }
};

const getBookById = async (req, res) => {
  try {
    console.log(`Fetching book with ID: ${req.params.id}`);
    const response = await axios.get(`${GUTENDEX_BASE_URL}/${req.params.id}`);
    if (response.status !== 200) {
      throw new Error('Book not found');
    }
    console.log(`Book data: ${JSON.stringify(response.data)}`);
    const apiId = response.data['id'];
    const title = response.data['title']
    const poster_path = response.data['formats']['image/jpeg'] || ['image/png'] || ['image/gif'] || null;

    let book = await Book.findOrCreate({
      apiId: apiId,
      title: title,
    }
    )
    await book.save()

    res.send(response.data)
  } catch (error) {
    throw new Error('Failed to fetch book from Gutendex.');
  }
};



module.exports = { searchBooks, getBookById };