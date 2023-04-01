import User from "../model/user.js"
import { verify_refresh_token } from '../libs/jwt.js'


const get_user_list = async (req, res) => {
    try {
        //get all user data
        const user = await User.find({ is_banned: false }) || []

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
        console.log(err.message);
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
                    display_name: user.display_name,
                    email: user.email,
                    description: user.description,
                    follower: user.follower,
                    following: user.following,
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
        const payload = req.body
        const { authorization: raw_token } = req.headers

        const token = raw_token.split(' ')[1]

        verify_refresh_token(token, async (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'forbidden'
                })
            }

            if (decoded.id === id) {
                // get all user data
                const user = await User.updateOne({ _id: id }, { $set: payload })

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
    update_profile
}

export default controller