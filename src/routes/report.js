import express from "express"
import controller from '../controller/report.js'
import { users, sysadmin } from "../middleware/privilege.js"

const report = express.Router()

// POST
report.post('/reports', sysadmin, controller.create_report)

// GET
report.get('/reports', sysadmin, controller.get_report_list)
report.get('/my/reports', common, controller.get_own_report_list)
report.get('/report/:id_report', sysadmin, controller.get_report_detail)
report.get('/my/report/:id_report', common, controller.get_report_detail)

// PUT
report.put('/report/:id_report', sysadmin, controller.approve_report)

// DELETE
report.delete('/report/:id_report', sysadmin, controller.takedown_report)

export default report