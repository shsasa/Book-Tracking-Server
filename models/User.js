const { Schema } = require('mongoose')

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    passwordDigest: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },


  },
  { timestamps: true }
)

module.exports = userSchema
