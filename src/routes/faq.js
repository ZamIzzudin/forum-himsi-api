import express from "express"
import faqController from '../controller/faq-controller.js'
import superAuth from "../middleware/super-auth.js"

const faq = express.Router()

faq.get('/faq/', faqController.getFaq)
faq.get('/faq/:id', faqController.getFaqById)
faq.post('/faq', superAuth, faqController.createFaq)
faq.put('/faq/:id', superAuth, faqController.editFaq)
faq.delete('/faq/:id', superAuth, faqController.deleteFaq)

export default faq