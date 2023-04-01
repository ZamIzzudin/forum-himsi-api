import express from "express"
import multer from "multer"
import controller from "../controller/profile.js"
import { sysadmin } from "../middleware/privilege.js"

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
        file.mimetype === 'image/png'
    ) {
        cb(null, true);
    } else {
        callback(null, false);
    }
};

const upload = multer({ storage: filestorage, fileFilter: fileFilter })

const profile = express.Router()

// GET
profile.get('/profile/users', controller.get_user_list)
profile.get('/profile/user/:id', controller.get_user)

// POST


// PUT
profile.put('/profile/user/:id', controller.update_profile)
profile.put('/profile/change-profile-picture/:id', sysadmin, upload.fields([
    { name: 'profile_picture', maxCount: 1 }
]), controller.change_profile_picture)

// DELETE


export default profile