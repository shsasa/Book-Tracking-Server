const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  apiId: { type: String, unique: true, required: true },
  poster_path: { type: String },
  author: { type: String },
  year: { type: String }
}, {
  timestamps: true
});

bookSchema.statics.findOrCreate = async function ({ apiId, title, poster_path, author, year }) {
  let book = await this.findOne({ apiId });

  if (book) {
    return book;
  } else {
    return await this.create({ apiId, title, poster_path, author, year });
  }

};

const Book = mongoose.model('Book', bookSchema);

module.exports = bookSchema

