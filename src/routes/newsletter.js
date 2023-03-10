import express from "express"
import newsLetterController from "../controller/newsletter-controller.js"

const newsletter = express.Router()

// newsletter.get('/audience', newsLetterController.getAllAudience)
// newsletter.get('/audience/:id', newsLetterController.getSpecificAudience)
// newsletter.get('/members/:id', newsLetterController.getAllMember)
// newsletter.get('/member/:id', newsLetterController.getSpecificMember)
// newsletter.get('/confirmation', newsLetterController.successSubcribed)


//post request for subscribe new letter himsi
newsletter.post('/member', newsLetterController.createMember)

//for development only
newsletter.put('/member', newsLetterController.updateMember)
newsletter.delete('/member', newsLetterController.deleteMember)

export default newsletter