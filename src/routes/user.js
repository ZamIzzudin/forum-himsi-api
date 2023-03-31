import express from "express"
import controller from "../controller/user.js";

const user = express.Router()

user.post('/auth/login', controller.login)
user.post('/auth/register', controller.create_user)
user.get('/auth/refresh', controller.refresh_token)

export default user