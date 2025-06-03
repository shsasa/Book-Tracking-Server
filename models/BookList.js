const { Schema } = require('mongoose')

const bookListSchema = new Schema(
  {
    name: { required: true },
    user: { required: true },
    books: [
      {
        apiId: { required: true },
        title: { required: true },
        poster_path: {}
      }
    ]
  },
  { timestamps: true }
)

module.exports = bookListSchema
