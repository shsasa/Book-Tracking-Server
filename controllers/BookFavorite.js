const BookFavorite = require('../models/bookFavorite')

const addFavorite = async (user, book) => {
  try {
    const newFavorite = new BookFavorite({ user, book })
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

const getFavoriteById = async (id) => {
  try {
    return await BookFavorite.findById(id).populate('user').populate('book')
  } catch (error) {
    console.error(error)
  }
}

const removeFavorite = async (id) => {
  try {
    await BookFavorite.findByIdAndDelete(id)
  } catch (error) {
    console.error(error)
  }
}

module.exports = { addFavorite, getFavorites, getFavoriteById, removeFavorite }
