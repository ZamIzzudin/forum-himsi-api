import express from "express"
import multer from "multer"
import superAuth from "../middleware/super-auth.js"
import bidangController from '../controller/bidang-controller.js'

//config images storage
const filestorage = multer.diskStorage({
    //path images storage
    // destination: (req, file, cb) => {
    //     cb(null, './public/images')
    // },
    //named the image file
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})

//allow image with format jpeg, jpg, or png only
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png'
    ) {
        cb(null, true);
    } else {
        callback(null, false);
    }
};

const upload = multer({
    storage: filestorage,
    fileFilter: fileFilter
})

const bidang = express.Router()

bidang.get('/bidang/', bidangController.getBidang)
bidang.get('/bidang/:id', bidangController.getBidangById)
bidang.post('/bidang', superAuth, upload.single('logo_bidang'), bidangController.createBidang)
bidang.put('/bidang/:id', superAuth, upload.single('logo_bidang'), bidangController.editBidang)
bidang.delete('/bidang/:id', superAuth, bidangController.deleteBidang)

export default bidang