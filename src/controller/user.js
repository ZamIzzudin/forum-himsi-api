import User from "../model/user.js";
import { encrpyt_one_way, pairing_one_way } from '../libs/crypt.js'
import { create_access_token, create_refresh_token, verify_refresh_token } from '../libs/jwt.js';

const create_user = async (req, res, next) => {
    const { password, email } = req.body;
    try {
        //check duplicated username
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'username was used'
            });
        }

        // set default
        const role = 'Common'
        const username = `Bald Fish ${Math.floor(Math.random() * 11) * Math.floor(Math.random() * 11)}`
        const display_name = username.toLowerCase().replace(' ', '_')
        const encrypted_password = await encrpyt_one_way(password)

        // create user
        const new_user = await User.create({
            username,
            display_name,
            email,
            password: encrypted_password
        });

        if (new_user) {
            //generate access token and refresh token
            const access_token = create_access_token(new_user._id, role);
            const refresh_token = create_refresh_token(new_user._id, role)

            //send cookie with contain refresh token
            res.cookie("refreshToken", refresh_token, {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24), //one day
                httpOnly: true,
                secure: true,
                sameSite: "none"
            });

            res.status(201).json({
                status: 201,
                message: 'success',
                username: new_user.username,
                role,
                access_token,
            });

        } else {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'failed to create an account'
            });
        }

    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
};

const login = async (req, res) => {

    const { email, password } = req.body;

    try {
        //check email is exist
        const user = await User.findOne({ email })

        //when data user is not found
        if (!user) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'email not exist, make sure to register your email first'
            });
        }

        //compare the password
        const hashPassword = await pairing_one_way(password.toString(), user.password)

        if (hashPassword) {
            //generate access token and refresh token
            const access_token = create_access_token(user._id, user.role);
            const refresh_token = create_refresh_token(user._id, user.role)

            //send cookie with contain refresh token 
            res.cookie("refreshToken", refresh_token, {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // one day
                httpOnly: true,
                secure: true,
                sameSite: "none"
            });

            res.status(200).json({
                status: 200,
                message: 'success',
                username: user.username,
                role: user.role,
                access_token
            });
        } else {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: "password doesn't match, please insert a correct password"
            });
        }

    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const refresh_token = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies
        //when user not sent cookie refresh token
        if (!refreshToken) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'forbidden'
            });
        }
        verify_refresh_token(refreshToken, (error, decoded) => {
            if (error) {
                console.log(error)
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'forbidden'
                });
            }

            // generate token
            const access_token = create_access_token(decoded.id, decoded.role)
            const refresh_token = create_refresh_token(decoded.id, decoded.role)

            //send cookie with contain refresh token
            res.cookie("refreshToken", refresh_token, {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24), //one day
                httpOnly: true,
                secure: true,
                sameSite: "none"
            });

            res.status(200).json({
                status: 200,
                message: 'success',
                role: decoded.role,
                access_token
            });
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const controller = {
    login,
    create_user,
    refresh_token
}

export default controller