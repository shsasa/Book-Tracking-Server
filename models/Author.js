const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  birthYear: { type: String },
  deathYear: { type: String },
}, {
  timestamps: true
});

// Static method: findOrCreate
authorSchema.statics.findOrCreate = async function ({ name, birthYear, deathYear }) {
  let author = await this.findOne({ name });

  if (author) {
    // ✔️ if found, return it
    return author;
  } else {
    // ✔️ if not found, create new
    return await this.create({ name, birthYear, deathYear });
  }
};

module.exports = authorSchema
