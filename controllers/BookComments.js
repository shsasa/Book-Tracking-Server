const BookComment = require('../models/BookComments')

const createComment = async (req, res) => {
  try {
    const { comment, user, book } = req.body
    const newComment = new BookComment({ comment, user, book })
    await newComment.save()
  } catch (error) {
    console.error(error)
  }
}

const getComments = async () => {
  try {
    return await BookComment.find().populate('user').populate('book')
  } catch (error) {
    console.error(error)
  }
}

const getCommentById = async (id) => {
  try {
    return await BookComment.findById(id).populate('user').populate('book')
  } catch (error) {
    console.error(error)
  }
}

const updateComment = async (id, newComment) => {
  try {
    return await BookComment.findByIdAndUpdate(
      id,
      { comment: newComment },
      { new: true }
    )
  } catch (error) {
    console.error(error)
  }
}

const deleteComment = async (id) => {
  try {
    await BookComment.findByIdAndDelete(id)
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  createComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment
}
