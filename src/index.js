const express= require('express');
const port = 3000
const app = express()
app.use(express.json())


require ('./db/mongoose')

const User = require('./models/user')
const UserRouter = require('./routers/user')
const TweetRouter = require('./routers/tweet')
const NotificationRouter = require('./routers/notification')

app.use(UserRouter)
app.use(TweetRouter)
app.use(NotificationRouter)


app.get('/', (req, res) => {
    res.send('Hello World123!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

