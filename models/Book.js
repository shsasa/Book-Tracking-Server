const mongoose = require('mongoose')
const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    apiId: {
      type: String,
      unique: true,
      required: true
    },
    poster_path: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

bookSchema.statics.findOrCreate = async function ({ apiId, title, poster_path }) {
  let book = await this.findOne({ apiId })

  if (book) {
    return book
  } else {
    console.log(`Creating new book with API ID: ${apiId}`)
    // If the book does not exist, create a new one
    book = await this.create({ apiId, title, poster_path })
    return book
  }
}





module.exports = bookSchema