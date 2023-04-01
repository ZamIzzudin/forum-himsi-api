import express from "express"
import multer from "multer"
import controller from '../controller/post.js'
import { verified, sysadmin } from "../middleware/privilege.js"

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
        file.mimetype === 'video/mp4'
    ) {
        cb(null, true);
    } else {
        callback(null, false);
    }
};

const upload = multer({ storage: filestorage, fileFilter: fileFilter })

const post = express.Router()

// Post
post.post('/post', verified, upload.fields([{ name: 'attachments', maxCount: 4 }]), controller.create_post)

// Get
post.get('/posts', controller.get_posts)
post.get('/post/:id_post', controller.get_detail_post)

// Delete
post.delete('/post/:id_post', verified, controller.verified_takedown_post)
post.delete('/post/admin/:id_post', sysadmin, controller.sysadmin_takedown_post)

// Put
post.put('/post/:id_post', verified, upload.fields([{ name: 'attachments', maxCount: 4 }]), controller.edit_post)
post.put('/post/like/:id_post', controller.like_post)

export default post