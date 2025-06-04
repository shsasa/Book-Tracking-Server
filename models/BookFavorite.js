const { Schema } = mongoose

const bookFavoriteSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }
  },
  { timestamps: true }
)

module.exports = bookFavoriteSchema
