import express from "express"
import superAuth from "../middleware/super-auth.js"
import adminController from '../controller/admin-controller.js'

const admin = express.Router()

admin.post('/login', adminController.login)
admin.get('/logout', adminController.logout)
admin.post('/register', adminController.register)

admin.get('/admin', superAuth, adminController.getAdmin)
admin.get('/admin/:id', superAuth, adminController.getAdminById)
admin.post('/admin', superAuth, adminController.createAdmin)
admin.put('/admin/:id', superAuth, adminController.editAdmin)
admin.delete('/admin/:id', superAuth, adminController.deleteAdmin)

export default admin