import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import router from './src/routes/index.js'
import config from './src/config/config.js'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// setup configuration
const { PORT, MONGO_URL } = config

// database (mongo) connection
try {
    mongoose.set('strictQuery', false);
    mongoose.connect(MONGO_URL, { useNewUrlParser: true })
    console.log('connect to db')
} catch (error) {
    console.log(error.message)
};

const app = express()

//middleware
app.use('/public', express.static(path.join(__dirname, '/public')))

//enable cors 
app.use(cors({
    credentials: true,
    origin: []
}))

//allow to access cookie
app.use(cookieParser());

//allow request with format x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//allow request with format json
app.use(bodyParser.json())

// route render
app.use(router)

// success flagging
app.listen(PORT, () => console.log(`server running on port ${PORT}`))

