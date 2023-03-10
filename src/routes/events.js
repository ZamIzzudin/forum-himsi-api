import express from "express"
import multer from "multer"
import auth from '../middleware/auth-user.js'
import eventController from '../controller/event-controller.js'

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

const upload = multer({ storage: filestorage, fileFilter: fileFilter })

const event = express.Router()

event.get('/event/', eventController.getEvent)
event.get('/event/:id', eventController.getEventById)
event.post('/event', auth, upload.fields([
    { name: 'header_event', maxCount: 1 },
    { name: 'gambar_event', maxCount: 1 },
    { name: 'dokumentasi_event' }
]), eventController.createEvent)
event.put('/event/:id', auth, upload.fields([
    { name: 'header_event', maxCount: 1 },
    { name: 'gambar_event', maxCount: 1 },
    { name: 'dokumentasi_event' }
]), eventController.editEvent)
event.delete('/event/:id', auth, eventController.deleteEvent)

export default event