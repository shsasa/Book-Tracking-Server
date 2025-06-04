const { Schema } = mongoose

const bookFavoriteSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }
  },
  { timestamps: true }
)

module.exports = bookFavoriteSchema
