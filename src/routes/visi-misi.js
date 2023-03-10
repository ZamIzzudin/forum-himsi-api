import express from "express"
import visiController from '../controller/visi-controller.js'
import superAuth from "../middleware/super-auth.js"

const visiMisi = express.Router()

visiMisi.get('/visi', visiController.getVisi)
visiMisi.put('/visi', superAuth, visiController.saveVisi)

export default visiMisi