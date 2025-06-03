const { Schema } = require('mongoose')
const GenreSchema = new Schema(
  {
    name: { required: true },
    details: {}
  },
  { timestamp: true }
)

module.exports = GenreSchema
