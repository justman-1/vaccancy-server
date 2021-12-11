require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const router = require('./router/index')

const server = require('http').createServer(app).listen(5000)

app.use(cors({
    origin: '*'
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/', router)