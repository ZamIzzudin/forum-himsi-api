import express from "express"
import controller from '../controller/post.js'

const post = express.Router()

post.post('/post', controller.create_post)
post.get('/post', controller.get_post)
post.get('/post/:id_post', controller.get_detail_post)
post.delete('/post/:id_post', controller.delete_post)
post.put('/post/:id_post', controller.edit_post)

export default post