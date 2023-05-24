import express from "express"
import multer from "multer"
import controller from '../controller/post.js'
import { verified, sysadmin } from "../middleware/privilege.js"

//config images storage
const filestorage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    },
    limits: {
        fileSize: 50 * 1024 * 1024
    },
})

//allow image with format image and video
const fileFilter = (req, file, cb) => {
    const acceptedTypes = file.mimetype.split('/');

    if (acceptedTypes[0] === 'image' || acceptedTypes[0] === 'video') {
        cb(null, true);
    } else {
        callback(null, false);
    }
};

const upload = multer({ storage: filestorage, fileFilter: fileFilter })

const post = express.Router()

// Post
post.post('/post', verified, upload.fields([{ name: 'video_attachments', maxCount: 4 }, { name: 'picture_attachments', maxCount: 4 }]), controller.create_post)

// Get
post.get('/posts', controller.get_posts)
post.get('/post/:id_post', controller.get_detail_post)

// Delete
post.delete('/post/:id_post', verified, controller.verified_takedown_post)
post.delete('/post/admin/:id_post', sysadmin, controller.sysadmin_takedown_post)

// Put
post.put('/post/:id_post', verified, upload.fields([{ name: 'video_attachments', maxCount: 4 }, { name: 'picture_attachments', maxCount: 4 }]), controller.edit_post)
post.put('/post/like/:id_post', controller.like_post)

export default post