const mongoose = require('mongoose')


const schema = mongoose.Schema
const tweetSchema = new schema({
    test:{
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    image: {
        type: Buffer

    },
    likes: {
        type: Array,
        default:[]
    }
},{
    timestamps: true
})

tweetSchema.methods.toJSON = function(){
    const tweet = this
    const tweetObject = tweet.toObject()

    if (tweetObject.image) {
        tweetObject.image = "true"
    }
    return tweetObject

}


const Tweet= mongoose.model('Tweet',tweetSchema)

module.exports = Tweet