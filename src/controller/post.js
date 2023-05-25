import Post from "../model/post.js"
import User from "../model/user.js"
import Discussion from '../model/discussion.js'
import Category from "../model/category.js"
import cloudinary from '../libs/cloudinary.js'
import { verify_access_token } from '../libs/jwt.js'

const create_post = async (req, res) => {
    const { category, body } = req.body
    const { picture_attachments = [] } = req.files
    const { video_attachments = [] } = req.files
    const { authorization: raw_token } = req.headers

    const token = raw_token.split(' ')[1]

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

            if (video_attachments?.length > 0) {
                await Promise.all(video_attachments.map(async (attachment) => {
                    await cloudinary.uploader.upload(attachment.path, { resource_type: 'video', chunk_size: 6000000, }).then(result => {
                        url_attachments.push({
                            public_id: result.public_id,
                            url: result.url
                        })
                    })
                }))
            }

            if (picture_attachments?.length > 0) {
                await Promise.all(picture_attachments.map(async (attachment) => {
                    const upload_picture = await cloudinary.uploader.upload(attachment.path)
                    const url_picture = upload_picture.secure_url
                    const url_public = upload_picture.public_id

                    url_attachments.push({
                        public_id: url_public,
                        url: url_picture
                    })
                }))
            }

            const payload = {
                category,
                body,
                attachments: url_attachments,
                created_by: decoded.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }

            const post = await Post.create(payload)

            if (!post) {
                return res.status(400).json({
                    status: 403,
                    message: 'failed',
                    info: 'failed to create a new post'
                })
            }

            category.forEach(async (each) => {
                const query_category = { name: { $in: [each] } }
                const categories = await Category.findOne(query_category)

                if (!categories) {
                    const payload_category = {
                        name: each,
                        posts: 1
                    }
                    await Category.create(payload_category)
                } else {
                    const posts_amount = ++categories.posts
                    await Category.updateOne(query_category, { posts: posts_amount })
                }
            })

            res.status(200).json({
                status: 200,
                message: "Success Add New Post",
                post
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
    let { category, page = 1 } = req.query;
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

                        let is_hide = post.is_hide || false

                        if (user.is_hide) {
                            is_hide = false
                        }

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
                                is_hide,
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

        const post_creator = await User.findOne({ _id: post.created_by })

        let is_hide = post.is_hide || false

        if (post_creator.is_hide) {
            is_hide = false
        }

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
                username: post_creator.username,
                display_name: post_creator.display_name,
                profile_picture: post_creator.profile_picture,
                is_hide,
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
    const { category, body } = req.body
    const { video_attachments = [], picture_attachments = [] } = req.files
    const { id_post } = req.params
    const { authorization: raw_token } = req.headers

    const token = raw_token.split(' ')[1]

    const query = { _id: id_post }

    try {
        verify_access_token(token, async (error, decoded) => {
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
                if (picture_attachments?.length > 0) {
                    await Promise.all(picture_attachments.map(async (attachment) => {
                        if (attachment.path) {
                            const upload_picture = await cloudinary.uploader.upload(attachment.path)
                            const url_picture = upload_picture.secure_url
                            const url_public = upload_picture.public_id

                            url_attachments.push({
                                public_id: url_public,
                                url: url_picture
                            })
                        } else {
                            maintained_attachment.push(attachment.public_id)
                            return attachment
                        }
                    }))
                }

                if (video_attachments?.length > 0) {
                    await Promise.all(video_attachments.map(async (attachment) => {
                        if (attachment.path) {
                            await cloudinary.uploader.upload(attachment.path, { resource_type: 'video', chunk_size: 6000000, }).then(result => {
                                url_attachments.push({
                                    public_id: result.public_id,
                                    url: result.url
                                })
                            })
                        } else {
                            maintained_attachment.push(attachment.public_id)
                            return attachment
                        }
                    }))
                }

                const payload = {
                    category,
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
        verify_access_token(token, async (error, decoded) => {
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
        verify_access_token(token, async (error, decoded) => {
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
                await Discussion.deleteMany({ topic: id_post })

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
        verify_access_token(token, async (error, decoded) => {
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
                await Discussion.deleteMany({ topic: id_post })

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