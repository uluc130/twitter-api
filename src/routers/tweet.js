const express = require('express')
const Tweet = require('../models/tweet')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const Note = require('../models/note')



const router =  new express.Router()


//HELPERS

const upload = multer({
    limits:{
        fileSize: 100000000
    }
})

// Add Tweet Image

router.post('/uploadTweetImage/:id', auth, upload.single('image'), async (req, res) =>{
    try {
        const tweet = await Tweet.findOne({ _id: req.params.id})
        console.log(tweet)
        if (!tweet) {
            throw new Error('tweet not found')
        }
        const buffer = await sharp(req.file.buffer).resize({width: 350, height:350}).png().toBuffer()
        tweet.image = buffer
        await tweet.save()
        res.status(201).send()
    } catch (error) {
        res.status(500).send(error)
    }


})

// View Tweet image

router.get('/viewTweetImage/:id', async (req, res) =>{
    try {
        const tweet = await Tweet.findById(req.params.id)

        if (!tweet && !tweet.image) {
            throw new Error("tweet not found")
        }

        res.set('Content-Type', 'image/jpg')
        res.send(tweet.image)
    } catch (error) {
        res.status(500).send(error)
    }

})

// Like a tweet

router.put('/tweets/:id/like', auth,  async(req, res) =>{
    
        try {
            const tweet = await Tweet.findById(req.params.id)
            if (!tweet.likes.includes(req.user.id)){
                
                await tweet.updateOne({ $push: { likes: req.user.id } })
                
                res. status(200).json("Liked")
            }else{
                res.status(403).json("you already liked this tweet")
            }
            
         } catch (err) {
            res.status(500).json(err)
         }
    
    })

// Unlike tweet

router.put('/tweets/:id/unlike', auth, async (req, res)=>{
    try {
        const tweet = await Tweet.findById(req.params.id)
            if (tweet.likes.includes(req.user.id)) {
                await tweet.updateOne({ $pull: { likes: req.user.id}})
                
                
               res. status(200).json("Tweet has been unliked")
            } 
            else {
                res.status(403).json("you don't liked this tweet")
            } 
        
    } catch (error) {
        res.status(500).send(error)
        
    }
})





// Post a tweet
router.post('/tweets', auth, async (req, res) => {
    const tweet = new Tweet({
        ...req.body,
        user:req.user._id
    })


        try {
            await tweet.save()
            res.json(tweet)
            console.log(tweet)
        } catch (error) {
            res.status(400).send(error)
        }

})

// Fetch tweets

router.get('/tweets', async (req, res) => {
    const tweets = await Tweet.find({})
    try {
        if (!tweets) {
            res.send(console.log("No Tweets"))
        } 
        else{
            res.send(tweets)
            console.log(tweets)
        }
        
    } catch (error) {
        res.status(500).send(error)
    }
})


// Fetch specific user's tweets

router.get('/tweets/:id', async (req, res) => {
    const tweets = await Tweet.find({userID: req.params.id })
    try {
        if (!tweets) {
            res.send(console.log("No Tweets"))
        } 
        else{
            res.status(201).send(tweets)
        }
        
    } catch (error) {
        res.status(500).send(error)
    }
})

// Post a note
router.post('/notes', auth, async (req, res) => {
    const note = new Note({
        ...req.body,
        user:req.user._id
    })


        try {
            await note.save()
            res.json(note)
            console.log(note)
        } catch (error) {
            res.status(400).send(error)
        }

})


module.exports = router