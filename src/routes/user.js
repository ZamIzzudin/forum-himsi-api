import express from "express"
import controller from "../controller/user.js"
import { sysadmin } from "../middleware/privilege.js"

const user = express.Router()

// GET
user.get('/auth/refresh', controller.refresh_token)
user.get('/auth/users', controller.get_user_list) // sementara nanti pindah ke module profile

// POST
user.post('/auth/login', controller.login)
user.post('/auth/register', controller.create_user)
user.post('/auth/approve-verified', sysadmin, controller.create_verified)

// PUT
user.put('/auth/banned/:id', sysadmin, controller.banned_user)
user.put('/auth/unbanned/:id', sysadmin, controller.unbanned_user)

// DELETE
user.delete('/auth/takedown/:id', sysadmin, controller.takedown_user)

export default user