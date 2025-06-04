const express = require('express');
const axios = require('axios');
const { Book, Author } = require('../models'); // Assuming you have a Book model defined

// Base URL for Gutendex API
const GUTENDEX_BASE_URL = 'https://gutendex.com/books';


// Search books


const searchBooks = async (req, res) => {
  try {
    const search = req.params.search || '';
    console.log(`Searching for books with query: ${search}`);
    const url = `${GUTENDEX_BASE_URL}?search=${encodeURIComponent(search)}`;
    console.log(url);
    const response = await axios.get(url);

    res.send(response.data.results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books from Gutendex.' });
  }
};

const getBookById = async (req, res) => {
  try {
    console.log(`Fetching book with ID: ${req.params.id}`);
    const response = await axios.get(`${GUTENDEX_BASE_URL}/${req.params.id}`);
    if (response.status !== 200) {
      throw new Error('Book not found');
    }
    const apiId = response.data['id'];
    const title = response.data['title']
    const poster_path = response.data['formats']['image/jpeg'] || ['image/png'] || ['image/gif'] || null;

    const year = response.data['publication_year'] || null;

    const authors = response.data['authors'].map(author => {
      return {
        name: author['name'],
        birthYear: author['birth_year'] || null,
        deathYear: author['death_year'] || null
      };

    });
    const authorList = []
    for (const authorData of authors) {
      const author = await Author.findOrCreate(authorData);

      await author.save();
      authorList.push(author._id);
    }



    let book = await Book.findOrCreate({
      apiId: apiId,
      title: title,
      poster_path: poster_path,
      authors: authorList,
      year: year
    }
    )
    await book.save()



    res.send(response.data)
  } catch (error) {
    throw new Error('Failed to fetch book from Gutendex.');
  }
};



module.exports = { searchBooks, getBookById };