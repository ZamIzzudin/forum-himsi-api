import express from "express"
import footerController from '../controller/footer-controller.js'
import superAuth from "../middleware/super-auth.js"

const footer = express.Router()

footer.get('/footer/', footerController.getFooter)
footer.get('/footer/:id', footerController.getFooterById)
footer.post('/footer', superAuth, footerController.createFooter)
footer.put('/footer/:id', superAuth, footerController.editFooter)
footer.delete('/footer/:id', superAuth, footerController.deleteFooter)

export default footer