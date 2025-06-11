const mongoose = require('mongoose');
const { Schema } = mongoose;

const readBookSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    status: {
      type: String,
      enum: ['not_started', 'reading', 'finished'],
      default: 'not_started'
    },
    currentPage: {
      type: Number,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ReadBook', readBookSchema);