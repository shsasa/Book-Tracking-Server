const { Schema } = mongoose

const readBookSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }
  },
  { timestamps: true }
)
//Reference:(https://stackoverflow.com/questions/38165736/prevent-duplicate-entries-in-array-in-mongoose-schema)
readBookSchema.index({ user: 1, book: 1 }, { unique: true })

module.exports = readBookSchema
