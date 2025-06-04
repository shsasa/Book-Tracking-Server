const { Schema } = mongoose

const bookCommentSchema = new Schema(
  {
    comment: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }
  },
  { timestamps: true }
)

module.exports = bookCommentSchema
