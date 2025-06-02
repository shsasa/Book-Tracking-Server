const { User } = require('../models')



const getUserByID = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('recipes')
    if (!user) {
      return res.status(404).send({ status: 'Error', msg: 'User not found!' })
    }
    res.status(200).send(user)
  } catch (error) {
    console.error(error)
    res
      .status(400)
      .send({ status: 'Error', msg: 'Error finding a user by ID!' })
  }
}

const getUserByQuery = async (req, res) => {
  try {
    let users = []
    for (const param of Object.keys(req.query)) {
      const results = await User.find({
        [param]: { $regex: req.query[param], $options: 'i' }
      })
      results.forEach((result) => {
        if (
          !users.some((user) => {
            return user._id.toString() === result._id.toString()
          })
        ) {
          users.push(result)
        }
      })
    }
    res.status(200).send(users)
  } catch (error) {
    console.error(error)
    res
      .status(400)
      .send({ status: 'Error', msg: 'Error finding a user by query!' })
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
    res.status(200).send(users)
  } catch (error) {
    console.error(error)
    res.status(400).send({ status: 'Error', msg: 'Error getting all users!' })
  }
}

const updateUserByID = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
    if (!user) {
      return res.status(404).send({ status: 'Error', msg: 'User not found!' })
    }
    res.status(200).send(user)
  } catch (error) {
    console.error(error)
    res.status(400).send({ status: 'Error', msg: 'Error updating a user!' })
  }
}

const deleteUserByID = async (req, res) => {
  try {
    let user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).send({ status: 'Error', msg: 'User not found!' })
    }
    await Recipe.deleteMany({ user: user._id })
    res.status(200).send({
      msg: 'User successfully deleted!',
      user: { _id: user._id, email: user.email }
    })
  } catch (error) {
    console.error(error)
    res.status(400).send({ status: 'Error', msg: 'Error deleting a user!' })
  }
}

module.exports = {
  getUserByID,
  getUserByQuery,
  getAllUsers,
  updateUserByID,
  deleteUserByID
}