const BannedBooks = require('../models/BannedBooks')

const addBannedBook = async (req, res) => {
  try {
    const { user, book } = req.body
    const bannedBook = new BannedBooks({ user, book })
    await bannedBook.save()
    res.status(201).send(`Banned books: ${user}`)
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`)
  }
}

const userBannedBook = async (req, res) => {
  try {
    const { user } = req.params
    const bannedBooks = await BannedBooks.find({ user }).populate('book')
    if (bannedBooks.length === 0)
      return res.status(404).send(`No banned books found : ${user}`)

    let responseText = `Banned Books for User ${user}:\n`
    bannedBooks.forEach((entry) => {
      responseText += `Books: ${entry.book
        .map((b) => b.toString())
        .join(', ')}\n`
    })
    res.status(200).send(responseText)
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`)
  }
}

module.export = { addBannedBook, userBannedBook }
