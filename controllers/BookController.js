const router = require('express').Router();
const { Book } = require('../models');
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

module.exports = {
  getAllBooks,
  getBookUrl
};





