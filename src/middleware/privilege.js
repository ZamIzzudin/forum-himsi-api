import { verify_access_token } from '../libs/jwt.js';

const common = (req, res, next) => {
    let access_token = req.headers.authorization
    if (!access_token) {
        return res.status(401).json({
            status: 401,
            message: 'failed',
            info: 'no detected token'
        });
    }

    try {
        access_token = access_token.split(' ')[1];
        verify_access_token(access_token, (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'expired token'
                });
            } else if (decoded.role.toLowerCase() !== 'common') {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'access denied'
                });
            }
            req.token = decoded
            next()
        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
};

const verified = (req, res, next) => {
    let access_token = req.headers.authorization
    if (!access_token) {
        return res.status(401).json({
            status: 401,
            message: 'failed',
            info: 'no detected token'
        });
    }

    try {
        access_token = access_token.split(' ')[1];
        verify_access_token(access_token, (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'expired token'
                });
            } else if (decoded.role.toLowerCase() !== 'verified') {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'access denied'
                });
            }
            req.token = decoded
            next()
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

const sysadmin = (req, res, next) => {
    let access_token = req.headers.authorization
    if (!access_token) {
        return res.status(401).json({
            status: 401,
            message: 'failed',
            info: 'no detected token'
        });
    }

    try {
        access_token = access_token.split(' ')[1];

        verify_access_token(access_token, (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'expired token'
                });
            } else if (decoded.role.toLowerCase() !== 'sysadmin') {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'access denied'
                });
            }
            req.token = decoded
            next()
        })

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        })
    }
}

const users = (req, res, next) => {
    let access_token = req.headers.authorization
    if (!access_token) {
        return res.status(401).json({
            status: 401,
            message: 'failed',
            info: 'no detected token'
        });
    }

    try {
        access_token = access_token.split(' ')[1];

        verify_access_token(access_token, (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'expired token'
                });
            } else if (decoded.role.toLowerCase() !== 'common' && decoded.role.toLowerCase() !== 'verified') {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'access denied'
                });
            }
            req.token = decoded
            next()
        })

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        })
    }
}


export { sysadmin, common, verified, users }