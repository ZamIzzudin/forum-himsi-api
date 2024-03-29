import Discussion from '../model/discussion.js'
import Post from "../model/post.js"
import User from "../model/user.js"
import { verify_access_token } from '../libs/jwt.js'

const create_discussion = (req, res, next) => {
    const { id_topic } = req.params
    const { authorization: raw_token } = req.headers
    const { body } = req.body

    const token = raw_token.split(' ')[1]

    try {
        verify_access_token(token, async (error, decoded) => {
            if (error && decoded.role.toLowerCase() === 'sysadmin') {
                return res.status(403).json({
                    status: 403,
                    message: 'failed',
                    info: 'unauthorized'
                })
            } else {
                const payload = {
                    created_by: decoded.id,
                    topic: id_topic,
                    body,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }

                const discussion = await Discussion.create(payload)

                const post = await Post.findOne({ _id: id_topic })

                const exist_discussion = post.discussion
                exist_discussion.push(discussion._id)

                await Post.updateOne({ _id: id_topic }, { discussion: exist_discussion })

                return res.status(203).json({
                    status: 203,
                    message: 'successfully create discussion'
                })
            }
        })
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        })
    }
}

const get_discussion_topic = async (req, res) => {
    const { id_topic } = req.params

    try {
        const result = await Discussion.find({ topic: id_topic })

        if (!result) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: "can't find discussion"
            })
        } else {
            let discussions = []
            discussions = await Promise.all(result.map(async discussion => {
                const user = await User.findOne({ _id: discussion.created_by })

                let is_hide = result.is_hide || false

                if (user.is_hide) {
                    is_hide = false
                }

                return {
                    id: discussion.id,
                    body: discussion.body,
                    topic: discussion.topic,
                    updated_at: discussion.updated_at,
                    created_by: discussion.created_by,
                    username: user.username,
                    is_hide,
                    display_name: user.display_name,
                    profile_picture: user.profile_picture
                }
            }))

            return res.status(200).json({
                status: 200,
                message: 'success',
                data: discussions
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

const user_edit_discussion = (req, res, next) => {
    const { id_layer } = req.params
    const { body } = req.body
    const { authorization: raw_token } = req.headers

    const token = raw_token.split(' ')[1]

    try {
        verify_access_token(token, async (error, decoded) => {
            if (error) {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "token not found"
                })
            }

            const discussion = await Discussion.findOne({ _id: id_layer })
            if (!discussion) {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "can't find discussion"
                })
            } else {
                if (decoded.id === discussion.created_by) {
                    await Discussion.updateOne({ _id: id_layer }, { body: body })

                    res.status(200).json({
                        status: 200,
                        message: `Success Update Discussion ${id_layer}`
                    })
                } else {
                    res.status(403).json({
                        status: 403,
                        message: 'failed',
                        info: "you dont have previlage to do this action"
                    })
                }
            }
        })
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        })
    }
}

const user_delete_discussion = (req, res, next) => {
    const { id_layer } = req.params
    const { authorization: raw_token } = req.headers

    const token = raw_token.split(' ')[1]

    try {
        verify_access_token(token, async (error, decoded) => {
            if (error) {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "token not found"
                })
            }

            const discussion = await Discussion.findOne({ _id: id_layer })
            if (!discussion) {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "can't find discussion"
                })
            } else {
                if (decoded.id === discussion.created_by) {
                    await Discussion.deleteOne({ _id: id_layer })
                    const post = await Post.findOne({ _id: discussion.topic })

                    const update_discussion = post.discussion.filter(each => each != id_layer)

                    await Post.updateOne({ _id: discussion.topic }, { discussion: update_discussion })

                    res.status(200).json({
                        status: 200,
                        message: `Success Delete Discussion ${id_layer}`
                    })
                } else {
                    res.status(403).json({
                        status: 403,
                        message: 'failed',
                        info: "you dont have previlage to do this action"
                    })
                }
            }
        })
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        })
    }
}

const sysadmin_edit_discussion = (req, res, next) => {
    const { id_layer } = req.params
    const { body } = req.body
    const { authorization: raw_token } = req.headers

    const token = raw_token.split(' ')[1]

    try {
        verify_access_token(token, async (error, decoded) => {
            if (error) {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "token not found"
                })
            }

            const discussion = await Discussion.findOne({ _id: id_layer })
            if (!discussion) {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "can't find discussion"
                })
            } else {
                if (decoded.role === 'sysadmin') {
                    await Discussion.updateOne({ _id: id_layer }, { body: body })

                    res.status(200).json({
                        status: 200,
                        message: `Success Update Discussion ${id_layer}`
                    })
                } else {
                    res.status(403).json({
                        status: 403,
                        message: 'failed',
                        info: "you dont have previlage to do this action"
                    })
                }
            }
        })
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        })
    }
}

const sysadmin_delete_discussion = (req, res, next) => {
    const { id_layer } = req.params
    const { authorization: raw_token } = req.headers

    const token = raw_token.split(' ')[1]

    try {
        verify_access_token(token, async (error, decoded) => {
            if (error) {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "token not found"
                })
            }

            const discussion = await Discussion.findOne({ _id: id_layer })
            if (!discussion) {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "can't find discussion"
                })
            } else {
                if (decoded.role.toLowerCase() === 'sysadmin') {
                    await Discussion.deleteOne({ _id: id_layer })
                    const post = await Post.findOne({ _id: discussion.topic })

                    const update_discussion = post.discussion.filter(each => each != id_layer)

                    const payload = {
                        discussion: update_discussion
                    }

                    await Post.updateOne({ _id: discussion.topic }, { discussion: update_discussion })

                    res.status(200).json({
                        status: 200,
                        message: `Success Delete Discussion ${id_layer}`
                    })
                } else {
                    res.status(403).json({
                        status: 403,
                        message: 'failed',
                        info: "you dont have previlage to do this action"
                    })
                }
            }
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
    create_discussion,
    get_discussion_topic,
    user_edit_discussion,
    user_delete_discussion,
    sysadmin_edit_discussion,
    sysadmin_delete_discussion
}

export default controller