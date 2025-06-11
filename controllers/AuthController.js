const { User } = require('../models')
const middleware = require('../middleware')

const Register = async (req, res) => {
  try {
    const { email, password, name } = req.body
    let passwordDigest = await middleware.hashPassword(password)
    let existingUser = await User.findOne({ email })
    if (existingUser) {
      return res
        .status(400)
        .send('A user with that email has already been registered!')
    } else {
      const user = await User.create({ name, email, passwordDigest })
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
      res.status(200).send(userData)
    }
  } catch (error) {
    console.error(error)
    res.status(500).send({ status: 'Error', msg: 'Registration failed!' })
  }
}

const Login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).send({ status: 'Error', msg: 'User not found' })
    }
    let matched = await middleware.comparePassword(
      password,
      user.passwordDigest
    )
    if (matched) {
      let payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
      let token = middleware.createToken(payload)
      return res.status(200).send({ user: userData, token })
    }
    res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
  } catch (error) {
    console.log(error)
    res
      .status(401)
      .send({ status: 'Error', msg: 'An error has occurred logging in!' })
  }
}

const UpdatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body
    let user = await User.findById(req.params.user_id)
    let matched = await middleware.comparePassword(
      oldPassword,
      user.passwordDigest
    )
    if (matched) {
      let passwordDigest = await middleware.hashPassword(newPassword)
      user = await User.findByIdAndUpdate(
        req.params.user_id,
        { passwordDigest },
        { new: true }
      )
      let payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
      return res
        .status(200)
        .send({ status: 'Password Updated!', user: payload })
    }
    res
      .status(401)
      .send({ status: 'Error', msg: 'Old Password did not match!' })
  } catch (error) {
    console.log(error)
    res.status(401).send({
      status: 'Error',
      msg: 'An error has occurred updating password!'
    })
  }
}

const CheckSession = async (req, res) => {
  const { payload } = res.locals
  res.status(200).send(payload)
}

module.exports = {
  Register,
  Login,
  UpdatePassword,
  CheckSession
}