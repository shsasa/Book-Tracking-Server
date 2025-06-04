const { Schema } = mongoose

const userNotesSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    notes: { type: String, required: true }
  },
  { timestamps: true }
)

//Reference:(https://stackoverflow.com/questions/38165736/prevent-duplicate-entries-in-array-in-mongoose-schema)
userNotesSchema.index({ user: 1, book: 1 }, { unique: true })

module.exports = userNotesSchema
