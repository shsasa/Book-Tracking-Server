
const express = require('express')
const logger = require('morgan')
const cors = require('cors')
require('dotenv').config()
const PORT = process.env.PORT || 3001


const app = express()
