const mongoose = require('mongoose')


const schema = mongoose.Schema
const noteSchema = new schema({
    note:{
        type: String, 
        required: true,
        trim: true
    },
    user:{
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    userID:{
        type: String,
        required: true
    }
},{
    timestamps: true
})

/* tweetSchema.methods.toJSON = function(){
    const tweet = this
    const tweetObject = tweet.toObject()

    if (tweetObject.image) {
        tweetObject.image = "true"
    }
} */

const Note = mongoose.model('Note',noteSchema)

module.exports = Note