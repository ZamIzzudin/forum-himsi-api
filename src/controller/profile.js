import User from "../model/user.js"
import Post from "../model/post.js"
import cloudinary from '../libs/cloudinary.js';
import { verify_access_token } from '../libs/jwt.js'

const get_user_list = async (req, res) => {
    const { organizational, username } = req.query

    let query = {
        is_banned: false, is_hide: false
    }

    if (username) {
        query = {
            ...query,
            'is_verified': {
                $in: [true]
            }
        }
    }

    if (organizational) {
        const is_verified = organizational ? true : false
        query = {
            ...query,
            'is_verified': {
                $in: [is_verified]
            }
        }
    }

    try {
        //get all user data
        const user = await User.find(query) || []

        //when data user is not found
        if (!user) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'cannot get user'
            })
        } else {
            res.status(200).json({
                status: 200,
                message: 'success',
                data: user ? user : []
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        })
    }
}

const get_user = async (req, res) => {
    try {
        const { id } = req.params

        //get all user data
        const user = await User.findOne({ is_banned: false, _id: id }) || []
        const posts = await Post.find({ created_by: id }).sort({ created_at: -1 })

        //when data user is not found
        if (!user || user.role === 'SysAdmin') {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'cannot get user'
            })
        } else {
            res.status(200).json({
                status: 200,
                message: 'success',
                data: {
                    id: user._id,
                    username: user.username,
                    profile_picture: user.profile_picture,
                    display_name: user.display_name,
                    email: user.email,
                    description: user.description,
                    follower: user.follower,
                    following: user.following,
                    posts,
                    subscription: user.subscription,
                    created_at: user.created_at
                }
            });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        })
    }
}

const update_profile = async (req, res) => {
    try {
        const { id } = req.params
        const { username, display_name, description } = req.body
        const { authorization: raw_token } = req.headers

        const token = raw_token.split(' ')[1]

        const payload = {
            username,
            display_name,
            description
        }

        verify_access_token(token, async (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'forbidden'
                })
            } else {
                if (decoded.id === id) {
                    // update user data
                    const user = await User.updateOne({ _id: id }, payload)

                    // when data user is not found
                    if (!user.acknowledged) {
                        return res.status(400).json({
                            status: 400,
                            message: 'failed',
                            info: 'cannot update user'
                        })
                    } else {
                        res.status(200).json({
                            status: 200,
                            message: 'success',
                            info: `successfully update user profile ${id}`
                        });
                    }
                } else {
                    return res.status(403).json({
                        status: 403,
                        message: 'failed',
                        info: 'you dont have previlege to do this action'
                    })
                }
            }
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        })
    }
}

const change_profile_picture = async (req, res) => {
    try {
        const { id } = req.params
        const { profile_picture } = req.files
        const { authorization: raw_token } = req.headers

        const token = raw_token.split(' ')[1]

        verify_access_token(token, async (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'forbidden'
                })
            } else {
                if (profile_picture.length === 0) {
                    return res.status(400).json({
                        status: 400,
                        message: 'failed',
                        info: "image doesn't exist"
                    })
                } else {
                    if (decoded.id === id) {
                        const path = profile_picture[0].path

                        const existing = await User.findOne({ _id: id })

                        if (!existing) {
                            return res.status(400).json({
                                status: 400,
                                message: 'failed',
                                info: "profile not found"
                            })
                        } else {
                            // delete old images
                            if (existing.profile_picture.public_id !== 'none') {
                                await cloudinary.uploader.destroy(existing.profile_picture.public_id)
                            }

                            // upload new image
                            const upload_profile_picture = await cloudinary.uploader.upload(path)
                            const url_picture = upload_profile_picture.secure_url
                            const url_public = upload_profile_picture.public_id

                            // update user data
                            const user = await User.updateOne({ _id: id }, {
                                $set: {
                                    profile_picture: {
                                        public_id: url_public,
                                        url: url_picture
                                    }
                                }
                            })

                            // when data user is not found
                            if (!user.acknowledged) {
                                return res.status(400).json({
                                    status: 400,
                                    message: 'failed',
                                    info: 'cannot update user'
                                })
                            } else {
                                res.status(200).json({
                                    status: 200,
                                    message: 'success',
                                    info: `successfully update user profile picture ${id}`
                                });
                            }
                        }
                    } else {
                        return res.status(403).json({
                            status: 403,
                            message: 'failed',
                            info: 'you dont have previlege to do this action'
                        })
                    }
                }
            }
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        })
    }
}

const controller = {
    get_user_list,
    get_user,
    update_profile,
    change_profile_picture
}

export default controller