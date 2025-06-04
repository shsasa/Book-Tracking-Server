const { Schema } = mongoose

const bookRatingSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
)
//Reference:(https://stackoverflow.com/questions/38165736/prevent-duplicate-entries-in-array-in-mongoose-schema)
bookRatingSchema.index({ user: 1, book: 1 }, { unique: true })

module.exports = bookRatingSchema
