import express from "express"
import multer from "multer"
import controller from '../controller/submission.js'
import { common, sysadmin } from "../middleware/privilege.js"

//config images storage
const filestorage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})

//allow image with format jpeg, jpg, or png only
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'application/pdf'
    ) {
        cb(null, true);
    } else {
        callback(null, false);
    }
};

const upload = multer({ storage: filestorage, fileFilter: fileFilter })

const submission = express.Router()

// GET
submission.get('/submissions', sysadmin, controller.get_submission_list)
submission.get('/submission/:id_submission', sysadmin, controller.get_submission_detail)

// POST
submission.post('/submission', upload.fields([{ name: 'attachments', maxCount: 4 }]), controller.create_submission)

// PUT
submission.put('/submission/:id_submission', sysadmin, controller.approve_submission)

// DELETE
submission.delete('/submission/:id_submission', sysadmin, controller.takedown_submission)

export default submission
