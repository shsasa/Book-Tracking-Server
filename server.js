
const express = require('express')
const logger = require('morgan')
const cors = require('cors')
require('dotenv').config()
const path = require('path');

const { UserRouter, AuthRouter, BookRouter } = require('./routes')


const PORT = process.env.PORT || 3000
const db = require('./db')


const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use('/epubs', express.static(path.join(__dirname, 'public/epubs')));

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/auth', AuthRouter)
app.use('/user', UserRouter)
app.use('/book', BookRouter)


app.use('/', (req, res) => {
  res.send(`Connected!`)
})

app.listen(PORT, () => {
  console.log(`Running Express server on Port ${PORT} . . .`)
})