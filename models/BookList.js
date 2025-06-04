const { Schema } = require('mongoose')

const bookListSchema = new Schema(
  {
    name: { type: String, required: true },
    user: { type: String, required: true },
    books: [
      {
        book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
        apiId: { type: String, required: true },
        title: { type: String, required: true },
        poster_path: { type: String }
      }
    ],
    // blockedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]

    private: { type: Boolean, default: false }
  },
  { timestamps: true }
)

module.exports = bookListSchema
