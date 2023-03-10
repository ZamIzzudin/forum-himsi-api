import express from "express"
import admin from './admin.js'
import token from './token.js'
import visiMisi from './visi-misi.js'
import faq from './faq.js'
import berita from './berita.js'
import link from './link.js'
import himpunan from "./himpunan.js"
import event from "./events.js"
import bidang from "./bidang.js"
import divisi from './divisi.js'
import pengurus from "./pengurus.js"
import newsletter from "./newsletter.js"
import partner from "./partner.js"
import sliderInformation from "./slider.js"
import footer from './footer.js'
import dashboard from "./dashboard.js"

const router = express.Router()

router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to UIN FORUM Rest API',
        createdBy: "Ayam Iyudin",
        version: "0.1"
    })
})

router.get('*', (req, res) => {
    res.send({
        status: 404,
        message: 'inappropriate command, please read the contact administrator'
    })
})

// router.use('/', admin)
// router.use('/', token)
// router.use('/', himpunan)
// router.use('/', visiMisi)
// router.use('/', faq)
// router.use('/', berita)
// router.use('/', link)
// router.use('/', event)
// router.use('/', bidang)
// router.use('/', divisi)
// router.use('/', pengurus)
// router.use('/', newsletter)
// router.use('/', partner)
// router.use('/', sliderInformation)
// router.use('/', footer)
// router.use('/', dashboard)

export default router