import express from "express"
import divisiController from '../controller/divisi-controller.js'
import superAuth from "../middleware/super-auth.js"

const divisiBidang = express.Router()

divisiBidang.get('/divisi/', divisiController.getDivisi)
divisiBidang.get('/divisi/:id', divisiController.getDivisiById)
divisiBidang.post('/divisi', superAuth, divisiController.createDivisi)
divisiBidang.put('/divisi/:id', superAuth, divisiController.editDivisi)
divisiBidang.delete('/divisi/:id', superAuth, divisiController.deleteDivisi)

export default divisiBidang