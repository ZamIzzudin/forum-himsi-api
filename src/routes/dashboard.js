import express from "express"
import dashboardController from '../controller/dashboard-controller.js'

const dashboard = express.Router()

dashboard.get('/bidang_dashboard', dashboardController.getBidangDashboard)
dashboard.get('/pengurus_dashboard', dashboardController.getPengurusDashboard)

export default dashboard