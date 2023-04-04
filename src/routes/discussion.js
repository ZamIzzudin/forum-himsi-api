import express from "express"
import controller from '../controller/discussion.js'
import { common, sysadmin } from "../middleware/privilege.js"

const discussion = express.Router()

// Post 
discussion.post('/discussion/:id_topic', controller.create_discussion)

// Get
discussion.get('/discussion/topic/:id_topic', controller.get_discussion_topic)
discussion.get('/discussion/layer/:id_layer', controller.get_discussion_layer)
discussion.get('/discussion/:id_layer', controller.get_discussion_detail)

// Put
discussion.put('/discussion/:id_layer', common, controller.user_edit_discussion)
discussion.put('/discussion/:id_layer', sysadmin, controller.get_discussion_detail)

// Delete
discussion.delete('/discussion/:id_layer', common, controller.get_discussion_detail)
discussion.delete('/discussion/admin/:id_layer', sysadmin, controller.get_discussion_detail)

export default discussion