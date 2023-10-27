const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const schema = mongoose.Schema

const userSchema = new schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
        }

    },
    password: {
        type: String,
        required:  true,
        minLength: 8,
        trim: true,
        validate(value){
            if(value.includes('password')){
                throw new Error('invalid passsword')
            }
        }
    },
    tokens:[{
        token: {
            type: String,
            required:true
        }
    }],
    avatar: {
        type: Buffer
    },
    avatarExists: {
        type: Boolean
    },
    bio: {
        type: String
    },
    website: String,

    location: {
        type: String
        
    },
    followers: {
        type: Array,
        default: []
    },
    followings: {
        type: Array,
        default: []
    }

})
//Relationship between user and Tweet

userSchema.virtual('Tweets',{
    ref:'Tweet',
    localField: '_id',
    foreignField: 'user'

})

userSchema.virtual('notificationSent', {
    ref: 'Notification',
    localField: '_id',
    foreignField: 'notSenderId'
})
userSchema.virtual('notificationReceived', {
    ref: 'Notification',
    localField: '_id',
    foreignField: 'notReceiverId'
})



// To delete password prior to GET
userSchema.methods.toJSON = function (){
    const user = this
    const userObject = user.toObject()

    delete userObject.password

    return userObject
}

// To Hash password

userSchema.pre('save', async function(next){
    const user = this
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})


// Create token
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()},'twittercourse')

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token

}


// Authentication Check
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if(!user){
        throw new Error('No Such User found')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('password is incorrect')
    }
    return user
}


const User = mongoose.model('user', userSchema)
module.exports = User