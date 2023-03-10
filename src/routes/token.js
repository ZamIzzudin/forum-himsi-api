import express from "express"
import tokenController from '../controller/token-controller.js'

const token = express.Router()

token.get('/refresh', tokenController.checkRefreshToken)

export default token