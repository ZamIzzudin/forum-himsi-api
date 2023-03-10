import express from "express"
import linkController from '../controller/link-controller.js'
import superAuth from "../middleware/super-auth.js"

const link = express.Router()

link.get('/link/', linkController.getLink)
link.get('/link/:id', linkController.getLinkById)
link.post('/link/', superAuth, linkController.createLink)
link.put('/link/:id', superAuth, linkController.editLink)
link.delete('/link/:id', superAuth, linkController.deleteLink)

export default link