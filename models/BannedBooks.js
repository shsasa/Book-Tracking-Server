const { Schema } = require('mongoose')

const bannedBookSchema = new Schema(
  {
    user: { type: String, required: true },
    book: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
  },
  { timestamps: true }
)

module.exports = bannedBookSchema
