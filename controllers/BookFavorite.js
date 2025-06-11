const BookFavorite = require('../models/bookFavorite')

const addFavorite = async ( book) => {
  try {
    const newFavorite = new BookFavorite({  book })
    await newFavorite.save()
  } catch (error) {
    console.error(error)
  }
}

const getFavorites = async () => {
  try {
    return await BookFavorite.find().populate('user').populate('book')
  } catch (error) {
    console.error(error)
  }
}


const removeFavorite = async (bookID) => {
  try {
    await BookFavorite.findByIdAndDelete(id)
  } catch (error) {
    console.error(error)
  }
}

module.exports = { addFavorite, getFavorites, getFavoriteById, removeFavorite }
