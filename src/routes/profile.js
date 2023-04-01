import express from "express"
import controller from "../controller/profile.js"
import { sysadmin } from "../middleware/privilege.js"

const profile = express.Router()

// GET
profile.get('/profile/users', controller.get_user_list)
profile.get('/profile/user/:id', controller.get_user)

// POST


// PUT
profile.put('/profile/user/:id', controller.update_profile)

// DELETE


export default profile