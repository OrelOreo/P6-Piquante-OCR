const mongoose = require('mongoose')
const mongooseErrors = require('mongoose-errors')

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String },
    manufacturer: { type: String },
    description: { type: String },
    mainPepper: { type: String },
    imageUrl: { type: String },
    heat: { type: Number },
    likes: { type: Number, default: 0 }, 
    dislikes: { type: Number, default: 0 }, 
    usersLiked: { type: [String], default: [] },
    usersDisliked: { type: [String], default: [] }, 
})

sauceSchema.plugin(mongooseErrors)

module.exports = mongoose.model('Sauce', sauceSchema)