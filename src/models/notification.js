const mongoose = require('mongoose')
const User = require('./user')

const schema = mongoose.Schema

const notificationSchema = new schema({
    username:{
        type: String,
        required: true
    },
    notSenderId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    notReceiverID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    notificationType: {
        type: String,
    },
    postText: {
        type: String,
    }
})

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification