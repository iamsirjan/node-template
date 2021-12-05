require('dotenv').config();
require('express-async-errors');
const express = require('express')
const app = express()
const authRouter  =  require('./routes/auth')
const errorHandlerMiddleware = require('./middleware/error-handler')
const connectDB = require('./db/connect')


//middleware

app.use(express.json())

app.use('/api/v1', authRouter)

app.use(errorHandlerMiddleware)
const port = 3001

const start = async() => {
    try {
        await connectDB(process.env.CONNECTION_URL)
        app.listen(port,console.log(`server is listening on port ${port}...`))
    } catch(error) {
        console.log(error)
    }
}

start()