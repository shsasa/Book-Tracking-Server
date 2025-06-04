const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  apiId: { type: String, unique: true, required: true },
  poster_path: { type: String },
  authors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }],
  year: { type: String },
  blocked: {
    blocked: { type: Boolean, default: false },
    reason: { type: String, default: '' },
    blockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }


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


module.exports = bookSchema

