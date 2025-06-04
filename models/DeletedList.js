const { Schema } = mongoose

const deletedListSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
  },
  { timestamps: true }
)

module.exports = deletedListSchema
