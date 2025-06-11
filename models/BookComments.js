const mongoose = require('mongoose');

const bookCommentSchema = new mongoose.Schema(
  {
    comment: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BookComment', bookCommentSchema);