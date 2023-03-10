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

//config
const { PORT, MONGO_URI } = config

try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true })
    console.log('connect to db')
} catch (error) {
    console.log(error.message)
};

const app = express()

//middleware
app.use('/public', express.static(path.join(__dirname, '/public')))
app.use(cors({
    credentials: true,
    origin: []
})) //enable cors 
app.use(cookieParser()); //allow to access cookie
app.use(bodyParser.urlencoded({ extended: false })) //allow request with format x-www-form-urlencoded
app.use(bodyParser.json()) //allow request with format json
app.use(router)

app.listen(PORT, () => console.log(`server running on port ${PORT}`))

