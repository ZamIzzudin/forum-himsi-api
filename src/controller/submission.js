import Submission from "../model/submission.js"
import User from "../model/user.js"
import { encrpyt_one_way } from '../libs/crypt.js'
import cloudinary from '../libs/cloudinary.js'

const create_submission = async (req, res, next) => {
    const { attachments } = req.files
    const { email, contact, name, password, organization } = req.body
    try {
        let url_attachments = []

        if (attachments?.length > 0) {
            url_attachments = await Promise.all(attachments.map(async (attachment) => {
                const upload_profile_picture = await cloudinary.uploader.upload(attachment.path)
                const url_picture = upload_profile_picture.secure_url
                const url_public = upload_profile_picture.public_id

                return {
                    public_id: url_public,
                    url: url_picture
                }
            }))
        }

        // set default 
        const encrypted_password = await encrpyt_one_way(password)

        const payload = {
            email,
            contact,
            name,
            password: encrypted_password,
            attachments: url_attachments,
            organization
        }



        const submission = await Submission.create(payload)
        if (!submission) {
            return res.status(400).json({
                status: 403,
                message: 'failed',
                info: 'failed to create a new submssion'
            })
        }

        res.status(200).json({
            status: 200,
            message: "Success Add New Submission"
        })

    } catch (err) {
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        })
    }
}

const get_submission_list = async (req, res, next) => {
    const { page = 1, status } = req.query

    const query = {}

    if (status) {
        query = {
            ...query,
            'status': {
                $in: [status]
            }
        }
    }

    try {
        Submission.find(query, (err, submissions) => {
            if (err) {
                return res.status(403).json({
                    status: 403,
                    message: 'failed',
                    info: 'cannot find submission'
                })
            } else {
                return res.status(200).json({
                    status: 200,
                    message: "success get submission list",
                    data: submissions
                })
            }
        }).skip((page - 1) * 10).limit(10).sort({ created_at: -1 })

    } catch (err) {
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        })
    }
}

const get_submission_detail = async (req, res, next) => {
    const { id_submission } = req.params

    const query = { _id: id_submission }

    try {
        const result = await Submission.findOne(query)

        if (!result) {
            res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'cannot find submission'
            })
        }

        res.status(200).json({
            status: 200,
            message: `success get submission detail ${id_submission}`,
            data: result
        })
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        })
    }
}

const approve_submission = (req, res, next) => {
    const { id_submission } = req.params
    try {


    } catch (err) {
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        })
    }
}

const takedown_submission = async (req, res, next) => {
    const { id_submission } = req.params
    const query = { _id: id_submission }
    try {
        const submission = await Submission.findOne(query)
        if (!submission) {
            res.status(400).json({
                status: 400,
                message: 'failed',
                info: "can't find post"
            })
        }

        await Submission.deleteOne(query)

        submission?.attachments.forEach(async (attachment) => {
            await cloudinary.uploader.destroy(attachment.public_id)
        })

        res.status(200).json({
            status: 200,
            message: `Success Delete Submission ${id_submission}`
        })
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        })
    }
}

const controller = {
    create_submission,
    get_submission_list,
    get_submission_detail,
    approve_submission,
    takedown_submission
}

export default controller