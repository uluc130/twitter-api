const express = require('express')
const User = require('../models/user')
const multer = require('multer')
const sharp = require('sharp')
const auth = require('../middleware/auth')

const router = new express.Router()




//HELPERS

const upload = multer({
    limits:{
        fileSize:100000000
    }
})


//ENDPOINTS

//Create User

router.post('/users', async (req, res)=>{
    const user = new User(req.body)

   try{
        await user.save()
        res.status(201).send(user)
   }
   catch(e){
        res.status(400).send(e)
   }

})

//Delete account

router.delete('/users/:id', async (req, res) => {
     try{
         const user = await User.findByIdAndDelete(req.params.id)
         
         if(!user){
             return res.status(404).send()
         }
         
         res.send("The user has been deleted")
     }
     catch(err){
         res.status(500).send(err)
     }
 })

// Get Users

router.get('/users',async (req, res)=>{
     try{
          const users = await User.find({})
          res.send(users)
      }
      catch(err){
          res.status(500).send(err)
      }
})

// Get Users by ID

router.get('/users/:id',async (req, res)=>{
     try{
          const user = await User.findById(req.params.id)
          res.send(user)

          if (!user){
               res.status(404).send()
          }
      }
      catch(err){
          res.status(500).send(err)
      }
})

// Login

router.post('/users/login', async (req, res)=>{
     
 
    try{
          const user = await User.findByCredentials(req.body.email, req.body.password)
          const token = await user.generateAuthToken()
          res.send({user, token})
    }
    catch(e){
         res.status(500).send(e)
    }
 
 })

 // Upload User profile image

 router.post('/users/me/avatar',auth, upload.single('avatar'), async(req, res)=> {
    
    const buffer = await sharp(req.file.buffer).resize({width: 250, height:250}).png().toBuffer()
   if (req.user.avatar != null){
       req.user.avatar = null
       req.user.avatarExists = false
   }

   req.user.avatar = buffer
   req.user.avatarExists = true
  await req.user.save()
 
    res.send(buffer)
 },(error, req, res, next) => {    
    res.status(400).send({error: error.message})
 })

 
 // View profile picture

 router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar){
            throw new error()
        }
    
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send(error)
    }

 })

 //Follow a user

 router.put('/users/follow/:id', auth,  async(req, res) =>{
if (req.user.id != req.params.id){
    try {
        const user = await User.findById(req.params.id)
        if (!user.followers.includes(req.user.id)){
            
            await user.updateOne({ $push: { followers: req.user.id } })
            await req.user.updateOne({$push:{followings: req.params.id}})
            res. status(200).json("User has been followed")
        }else{
            res.status(403).json("you already follow this user")
        }
        
     } catch (err) {
        res.status(500).json(err)
     }
}
else {
    res.status(403).json("You cannot follow yourself")
}
})

// Unfollow a user

router.put('/users/:id/unfollow', auth, async (req, res)=>{
    try {
        const user = await User.findById(req.params.id)
            if (user.followers.includes(req.user.id)) {
                await user.updateOne({ $pull: { followers: req.user.id}})
                await req.user.updateOne({ $pull: { followings: req.params.id}})
                
               res. status(200).json("User has been unfollowed")
            } 
            else {
                res.status(403).json("you don't follow this user")
            } 
        
    } catch (error) {
        res.status(500).send(error)
        
    }
})

// Update User

router.patch('/users/me', auth, async (req, res)=>{
    const updates = Object.keys(req.body)
    console.log(updates)

    const allowedUpdates = ['name', 'website', 'bio', 'password', 'location']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid request'})
    }
    try {
        const user = req.user
        //console.log(user.name)
        //console.log(req.body)
        updates.forEach((update) => {user[update] = req.body[update]})
        await user.save()
        res.send(user)

    } catch (error) {
        res.status(400).send(error)
    }


})
 
 

module.exports = router