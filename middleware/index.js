const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('./multer.js')

require('dotenv').config()


const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS)
const APP_SECRET = process.env.APP_SECRET


const hashPassword = async (password) => {
  // Accepts a password from the request body
  let hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
  // Creates a hashed password and encrypts it 12 times
  return hashedPassword
}


const comparePassword = async (password, storedPassword) => {
  // Accepts the password provided in the login request and the currently stored password
  // Compares the two passwords for a match
  let passwordMatch = await bcrypt.compare(password, storedPassword)
  // Returns true if the passwords match
  // Returns false if the passwords are not a match
  return passwordMatch
}

const createToken = (payload) => {
  // Accepts a payload with which to create the token
  let token = jwt.sign(payload, APP_SECRET)
  // Generates the token and encrypts it, returns the token when the process finishes
  return token
}


const stripToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ msg: 'No authorization header provided' });
    }
    const token = authHeader.split(' ')[1];
    if (token) {
      res.locals.token = token;
      return next();
    } else {
      return res.status(401).json({ msg: 'Malformed authorization header' });
    }
  } catch (error) {
    return res.status(401).json({ msg: 'Invalid token' });
  }
};

const verifyToken = (req, res, next) => {
  const { token } = res.locals
  // Gets the token stored in the request lifecycle state
  try {
    let payload = jwt.verify(token, APP_SECRET)
    // Verifies the token is legit
    if (payload) {
      res.locals.payload = payload // Passes the decoded payload to the next function
      // Calls the next function if the token is valid
      return next()
    }
    res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
  } catch (error) {
    console.log(error)
    res.status(401).send({ status: 'Error', msg: 'Verify Token Error!' })
  }
}

const isAdmin = (req, res, next) => {
  const { payload } = res.locals
  if (payload.role === 'admin') {
    return next()
  }
  res.status(403).send({ status: 'Error', msg: 'Forbidden' })
}



module.exports = {
  hashPassword,
  comparePassword,
  createToken,
  stripToken,
  verifyToken,
  multer,
  isAdmin
}