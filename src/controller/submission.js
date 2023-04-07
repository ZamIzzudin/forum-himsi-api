import Submission from "../model/submission.js"
import User from "../model/user.js"
import cloudinary from '../libs/cloudinary.js'
import { encrpyt_one_way } from '../libs/crypt.js'
import { verify_access_token } from '../libs/jwt.js'

const create_submission = async (req, res, next) => {
    const { attachments } = req.files
    const { email, contact, name, password, organization } = req.body
    try {
        verify_access_token(token, async (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'forbidden'
                })
            }

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
                organization,
                created_by: decoded.id
            }

            const submission = await Submission.create(payload)
            if (!submission) {
                return res.status(400).json({
                    status: 403,
                    message: 'failed',
                    info: 'failed to create a new submssion'
                })
            }

            return res.status(200).json({
                status: 200,
                message: "Success Add New Submission"
            })
        })
    } catch (err) {
        return res.status(500).json({
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
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        })
    }
}

const get_own_submission_list = async (req, res, next) => {
    const { page = 1, status } = req.query

    try {
        verify_access_token(token, async (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'forbidden'
                })
            }
            const query = { created_by: decoded.id }

            if (status) {
                query = {
                    ...query,
                    'status': {
                        $in: [status]
                    }
                }
            }

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

        })
    } catch (err) {
        return res.status(500).json({
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
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'cannot find submission'
            })
        }

        return res.status(200).json({
            status: 200,
            message: `success get submission detail ${id_submission}`,
            data: result
        })
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        })
    }
}

const approve_submission = async (req, res, next) => {
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

        await Submission.updateOne(query, { status: 'Approved', updated_at: new Date().toISOString() })

        // Make Account
        const role = 'Verified'
        const is_verified = true
        const username = `Emmo Fish ${Math.floor(Math.random() * 11) * Math.floor(Math.random() * 11)}`
        const display_name = username.toLowerCase().replace(' ', '_')

        const new_user = await User.create({
            username,
            display_name,
            email: result.email,
            role,
            is_verified,
            password: result.password
        })

        if (!new_user) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'failed to create an account'
            })
        } else {
            return res.status(200).json({
                status: 200,
                message: `success approve submission ${id_submission}`,
            })
        }

    } catch (err) {
        return res.status(500).json({
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
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: "can't find post"
            })
        }

        await Submission.deleteOne(query)

        submission?.attachments.forEach(async (attachment) => {
            await cloudinary.uploader.destroy(attachment.public_id)
        })

        return res.status(200).json({
            status: 200,
            message: `Success Delete Submission ${id_submission}`
        })
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        })
    }
}

const controller = {
    create_submission,
    get_submission_list,
    get_own_submission_list,
    get_submission_detail,
    approve_submission,
    takedown_submission
}

export default controller