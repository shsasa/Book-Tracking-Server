const BannedBooks = require('../models/BannedBooks')

const bannedBook = async (req, res) => {
  try {
    const { user, book } = req.body
    const bannedBook = new BannedBooks({ user, book })
    await bannedBook.save()
    res.status(201).send(`Banned books: ${user}`)
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`)
  }
}
