const mongoose = require('mongoose')
const userScehma = mongoose.Schema({
    email : { type: String, required: true, unique: true},
    password: { type: String, required: true }
})

module.exports = mongoose.model('User', userScehma)