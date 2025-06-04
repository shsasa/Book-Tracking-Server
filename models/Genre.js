const { Schema } = require('mongoose')
const GenreSchema = new Schema(
  {
    name: { type: String, required: true },
    details: {}
  },
  { timestamp: true }
)

module.exports = GenreSchema
