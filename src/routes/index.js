import express from "express"
import post from "./post.js"
import user from "./user.js"
import profile from "./profile.js"

const router = express.Router()

router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to UIN FORUM Rest API',
        createdBy: "Ayam Iyudin",
        version: "0.1"
    })
})

router.use('/', post)
router.use('/', user)
router.use('/', profile)

router.get('*', (req, res) => {
    res.send({
        status: 404,
        message: 'inappropriate command, please read the contact administrator'
    })
})
export default router