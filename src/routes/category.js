import express from "express"
import controller from '../controller/category.js'

const category = express.Router()

// Get
category.get('/category', controller.get_category)

export default category