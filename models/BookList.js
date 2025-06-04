const { Schema } = require('mongoose')

const bookListSchema = new Schema(
  {
    name: { type: String, required: true },
    user: { type: String, required: true },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
  },
  { timestamps: true }
)

module.exports = bookListSchema
