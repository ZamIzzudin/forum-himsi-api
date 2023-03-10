import { createAccessToken, verifyRefreshToken } from '../libs/jwt.js';

const checkRefreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies
        //when admin not sent cookie refresh token
        if (!refreshToken) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'forbidden'
            });
        }
        verifyRefreshToken(refreshToken, (error, decoded) => {
            if (error) {
                console.log(error)
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'forbidden'
                });
            }
            const accessToken = createAccessToken(decoded.id, decoded.role)
            res.status(200).json({
                status: 200,
                message: 'success',
                role: decoded.role,
                accessToken: accessToken
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

const tokenController = {
    checkRefreshToken
}

export default tokenController