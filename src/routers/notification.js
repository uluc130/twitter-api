const express = require('express')
const auth = require('../middleware/auth')
const Notification = require('../models/notification')

const router = new express.Router()

// Post a

router.post('/notification', auth, async (req, res) => {
    const notification = new Notification({
        ...req.body,
        notSenderId: req.user._id
    })
try {
    await notification.save()
        res.status(201).send(notification)
} catch (error) {
    res.status(400).send(error)
}

})

// Fetch  Notifications

router.get('/notifications', async (req, res)=>{
    const notifications = await Notification.find({})
    try {
        if (!notifications) {
            return res.status(400).send()
            
        }
        res.send(notifications)

    } catch (error) {
        res.status(500).send(error)
    }
})

// Fetch  specicifis users notifications

router.get('/notifications/:id', async (req, res)=>{
    const notifications = await Notification.find({notReceiverID: req.params.id})
    try {
        if (!notifications) {
            return res.status(400).send()
            
        }
        res.send(notifications)

    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router


