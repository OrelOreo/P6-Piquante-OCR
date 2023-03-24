require('dotenv').config()
const express = require('express')
const helmet = require('helmet');
const path = require('path')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const sauceRoutes = require('./routes/sauce')

const usernameDB = process.env.DB_USERNAME
const passwordDB = process.env.DB_PASSWORD

mongoose.connect(`mongodb+srv://${usernameDB}:${passwordDB}@p6piquante.w0hraug.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => console.log('Connected to MongoDB ! '))
    .catch((error) => console.error(error,'Error connecting to the MongoDB :/'))

const app = express()

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
})

app.use('/api/sauces', sauceRoutes)
app.use('/api/auth', userRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app