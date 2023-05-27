import express from "express"
import post from "./post.js"
import user from "./user.js"
import discussion from "./discussion.js"
import submission from "./submission.js"
import profile from "./profile.js"
import category from "./category.js"

const router = express.Router()

router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to UIN FORUM Rest API',
        createdBy: "Ayam Iyudin",
        version: "0.1"
    })
})

router.use('/', post)
router.use('/', discussion)
router.use('/', user)
router.use('/', profile)
router.use('/', submission)
router.use('/', category)

router.get('*', (req, res) => {
    res.send({
        status: 404,
        message: 'inappropriate command, please read documentation or contact the administrator'
    })
})
export default router