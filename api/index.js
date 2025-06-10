const express = require('express');
const axios = require('axios');
const { Book, Author } = require('../models');

const GUTENDEX_BASE_URL = 'https://gutendex.com/books';

// Search books from Gutendex
const searchBooks = async (req, res) => {
  try {
    const search = req.params.search || '';
    console.log(`Searching for books with query: ${search}`);
    const url = `${GUTENDEX_BASE_URL}?search=${encodeURIComponent(search)}`;
    const response = await axios.get(url);

    res.send(response.data.results);
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ error: 'Failed to fetch books from Gutendex.' });
  }
};

// Get book by ID and persist it locally
const getBookById = async (req, res) => {
  try {
    console.log(`Fetching book with ID: ${req.params.id}`);
    const response = await axios.get(`${GUTENDEX_BASE_URL}/${req.params.id}`);

    if (response.status !== 200) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const data = response.data;
    const apiId = data.id;
    const title = data.title;

    const formats = data.formats;
    const poster_path = formats['image/jpeg'] || formats['image/png'] || formats['image/gif'] || null;
    const year = data.publication_year || null;

    const authors = data.authors.map(author => ({
      name: author.name,
      birthYear: author.birth_year || null,
      deathYear: author.death_year || null
    }));

    const authorList = [];
    for (const authorData of authors) {
      const author = await Author.findOrCreate(authorData);
      authorList.push(author._id);
    }

    const book = await Book.findOrCreate({
      apiId,
      title,
      poster_path,
      authors: authorList,
      year
    });

    res.send(data);
  } catch (error) {
    console.error('Fetch book error:', error.message);
    res.status(500).json({ error: 'Failed to fetch book from Gutendex.' });
  }
};

module.exports = { searchBooks, getBookById };
