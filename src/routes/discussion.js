import express from "express"
import controller from '../controller/discussion.js'
import { sysadmin, users } from "../middleware/privilege.js"

const discussion = express.Router()

// Post 
discussion.post('/discussion/:id_topic', users, controller.create_discussion)

// Get
discussion.get('/discussion/topic/:id_topic', controller.get_discussion_topic)

// Put
discussion.put('/discussion/:id_layer', users, controller.user_edit_discussion)
discussion.put('/discussion/admin/:id_layer', sysadmin, controller.sysadmin_edit_discussion)

// Delete
discussion.delete('/discussion/:id_layer', users, controller.user_delete_discussion)
discussion.delete('/discussion/admin/:id_layer', sysadmin, controller.sysadmin_delete_discussion)

export default discussion