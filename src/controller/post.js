import Post from "../model/post.js"
import User from "../model/user.js"
import cloudinary from '../libs/cloudinary.js';
import { verify_refresh_token } from '../libs/jwt.js'

const create_post = async (req, res) => {
    const { category, head, body } = req.body
    const { attachments = [] } = req.files
    const { authorization: raw_token } = req.headers

    const token = raw_token.split(' ')[1]

    try {
        verify_refresh_token(token, async (error, decoded) => {
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

            const payload = {
                category,
                head,
                body,
                attachments: url_attachments,
                created_by: decoded.id,
                created_at: new Date().toISOString(),
            }

            const post = await Post.create(payload)

            if (!post) {
                return res.status(400).json({
                    status: 403,
                    message: 'failed',
                    info: 'failed to create a new post'
                })
            }

            res.status(200).json({
                status: 200,
                message: "Success Add New Post"
            })
        })
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        })
    }
}

const get_posts = async (req, res) => {
    let { category, topic, page = 1 } = req.query;
    let query = {}

    //filter by category
    if (category) {
        query = {
            ...query,
            'category': {
                $in: [category]
            }
        }
    }

    if (topic) {
        query = {
            ...query,
            'head': {
                $regex: topic,
                $options: "i"
            }
        }
    }

    try {
        Post.find(query, async (err, posts) => {
            if (err) {
                return res.status(403).json({
                    status: 403,
                    message: 'failed',
                    info: 'cannot find posts'
                })
            } else {
                let setup_posts = []
                if (posts?.length > 0) {
                    setup_posts = await Promise.all(posts.map(async (post) => {
                        const user = await User.findOne({ _id: post.created_by })

                        if (user) {
                            return {
                                id: post._id,
                                category: post.category,
                                head: post.head,
                                body: post.body,
                                attachments: post.attachments,
                                likes: post.likes,
                                discussion: post.discussion,
                                username: user.username,
                                display_name: user.display_name,
                                profile_picture: user.profile_picture,
                                updated_at: post.updated_at
                            }
                        }
                    }))
                }

                return res.status(200).json({
                    status: 200,
                    message: "success get post list",
                    data: setup_posts
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

const get_detail_post = async (req, res) => {
    const { id_post } = req.params

    const query = { _id: id_post }

    try {
        const post = await Post.findOne(query)
        if (!post) {
            res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'cannot find post'
            })
        }

        const user = await User.findOne({ _id: post.created_by })

        res.status(200).json({
            status: 200,
            message: `Success Get Detail Post ${id_post}`,
            data: {
                id: post._id,
                category: post.category,
                head: post.head,
                body: post.body,
                attachments: post.attachments,
                likes: post.likes,
                discussion: post.discussion,
                username: user.username,
                display_name: user.display_name,
                profile_picture: user.profile_picture,
                updated_at: post.updated_at
            }
        })
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        })
    }
}

const edit_post = async (req, res) => {
    const { category, head, body } = req.body
    const { attachments = [] } = req.files
    const { id_post } = req.params
    const { authorization: raw_token } = req.headers

    const token = raw_token.split(' ')[1]

    const query = { _id: id_post }

    try {
        verify_refresh_token(token, async (error, decoded) => {
            if (error) {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "token not found"
                })
            }

            const post = await Post.findOne(query)
            if (!post) {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "can't find post"
                })
            }

            let maintained_attachment = []
            let url_attachments = []

            if (decoded.id === post.created_by) {
                if (attachments?.length > 0) {
                    url_attachments = await Promise.all(attachments.map(async (attachment) => {
                        if (attachment.path) {
                            const upload_profile_picture = await cloudinary.uploader.upload(attachment.path)
                            const url_picture = upload_profile_picture.secure_url
                            const url_public = upload_profile_picture.public_id

                            return {
                                public_id: url_public,
                                url: url_picture
                            }
                        } else {
                            maintained_attachment.push(attachment.public_id)
                            return attachment
                        }
                    }))
                }

                const payload = {
                    category,
                    head,
                    body,
                    attachments: url_attachments,
                    updated_at: new Date().toISOString(),
                }

                await Post.updateOne(query, payload)

                const deleted_attachment = post.attachments.filter((attachment) => {
                    if (!maintained_attachment.includes(attachment)) {
                        return attachment
                    }
                }) || []

                deleted_attachment.forEach(async (attachment) => {
                    await cloudinary.uploader.destroy(attachment.public_id)
                })

                res.status(200).json({
                    status: 200,
                    message: `Success Update Post ${id_post}`
                })
            } else {
                res.status(403).json({
                    status: 403,
                    message: 'failed',
                    info: "you dont have previlage to do this action"
                })
            }
        })

    } catch (err) {
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        })
    }
}

const like_post = async (req, res) => {
    const { id_post } = req.params
    const { authorization: raw_token } = req.headers

    const query = { _id: id_post }

    const token = raw_token.split(' ')[1]

    try {
        verify_refresh_token(token, async (error, decoded) => {
            if (error || decoded.role.toLowerCase() === 'sysadmin') {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "unautorized"
                })
            }

            const post = await Post.findOne(query)
            if (!post) {
                res.status(403).json({
                    status: 403,
                    message: 'failed',
                    info: "can't find post"
                })
            }

            let likes = post.likes
            let message = ''

            if (likes.includes(decoded.id)) {
                likes = likes.filter(like => like !== decoded.id)
                message = 'success unliked post'
            } else {
                likes.push(decoded.id)
                message = 'success liked post'
            }

            await Post.updateOne(query, { likes })

            res.status(200).json({
                status: 200,
                message: 'success',
                info: message
            })
        })
    } catch {
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        })
    }
}

const verified_takedown_post = async (req, res) => {
    const { id_post } = req.params
    const { authorization: raw_token } = req.headers

    const token = raw_token.split(' ')[1]

    const query = { _id: id_post }

    try {
        verify_refresh_token(token, async (error, decoded) => {
            if (error) {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "token not found"
                })
            }

            const post = await Post.findOne(query)
            if (!post) {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "can't find post"
                })
            }

            if (decoded.id === post.created_by) {
                await Post.deleteOne(query)

                post.attachments.forEach(async (attachment) => {
                    await cloudinary.uploader.destroy(attachment.public_id)
                })

                res.status(200).json({
                    status: 200,
                    message: `Success Delete Post ${id_post}`
                })
            } else {
                res.status(403).json({
                    status: 403,
                    message: 'failed',
                    info: "you dont have previlage to do this action"
                })
            }
        })
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        })
    }
}

const sysadmin_takedown_post = async (req, res) => {
    const { id_post } = req.params
    const { authorization: raw_token } = req.headers

    const token = raw_token.split(' ')[1]

    const query = { _id: id_post }

    try {
        verify_refresh_token(token, async (error, decoded) => {
            if (error) {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "token not found"
                })
            }

            const post = await Post.findOne(query)
            if (!post) {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "can't find post"
                })
            }

            if (decoded.role.toLowerCase() === 'sysadmin') {
                await Post.deleteOne(query)

                post.attachments.forEach(async (attachment) => {
                    await cloudinary.uploader.destroy(attachment.public_id)
                })

                res.status(200).json({
                    status: 200,
                    message: `Success Delete Post ${id_post}`
                })
            } else {
                res.status(403).json({
                    status: 403,
                    message: 'failed',
                    info: "you dont have previlage to do this action"
                })
            }
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
    create_post,
    get_detail_post,
    get_posts,
    edit_post,
    like_post,
    verified_takedown_post,
    sysadmin_takedown_post
}

export default controller