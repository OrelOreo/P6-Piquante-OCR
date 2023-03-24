const mongoose = require('mongoose')
const mongooseErrors = require('mongoose-errors')

const userScehma = mongoose.Schema({
    email : { type: String, required: true, unique: true},
    password: { type: String, required: true }
})

userScehma.plugin(mongooseErrors)

module.exports = mongoose.model('User', userScehma)