import Post from "../model/post.js"
import Discussion from "../model/discussion.js"
import User from "../model/user.js"
import Report from "../model/report.js"
import { verify_access_token } from '../libs/jwt.js'

const create_report = (req, res, next) => {
    const { content, reason, type } = req.body
    try {
        verify_access_token(token, async (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'forbidden'
                })
            } else {
                const payload = {
                    content,
                    reason,
                    type,
                    created_by: decoded.id
                }

                await Report.create(payload)

                return res.status(203).json({
                    status: 203,
                    message: 'success',
                    message: 'success create report'
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

const get_report_list = async (req, res, next) => {
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
        Report.find(query, (err, reports) => {
            if (err) {
                return res.status(403).json({
                    status: 403,
                    message: 'failed',
                    info: 'cannot find any report'
                })
            } else {
                return res.status(200).json({
                    status: 200,
                    message: "success get report list",
                    data: reports
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

const get_own_report_list = async (req, res, next) => {
    const { page = 1, status } = req.query

    try {
        verify_access_token(token, async (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'forbidden'
                })
            } else {
                const query = { created_by: decoded.id }

                if (status) {
                    query = {
                        ...query,
                        'status': {
                            $in: [status]
                        }
                    }
                }

                await Report.find(query, (err, reports) => {
                    if (err) {
                        return res.status(403).json({
                            status: 403,
                            message: 'failed',
                            info: 'cannot find any report'
                        })
                    } else {
                        return res.status(200).json({
                            status: 200,
                            message: "success get report list",
                            data: reports
                        })
                    }
                }).skip((page - 1) * 10).limit(10).sort({ created_at: -1 })
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

const get_report_detail = async (req, res, next) => {
    const { id_report } = req.params

    const query = { _id: id_report }

    try {
        const result = await Report.findOne(query)

        if (!result) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'cannot find report'
            })
        } else {
            return res.status(200).json({
                status: 200,
                message: `success get report detail ${id_report}`,
                data: result
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

const approve_report = (req, res, next) => {
    const { id_report } = req.params
    const { status } = req.body

    const query = { _id, id_report }
    try {
        verify_access_token(token, async (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'forbidden'
                })
            } else {
                const report = await Report.findOne(query)

                if (!report) {
                    return res.status(401).json({
                        status: 401,
                        message: 'failed',
                        info: `cannot find report ${id_report}`
                    })
                } else {
                    await Report.updateOne(query, { status: status, updated_at: new Date().toISOString() })

                    switch (report.type) {
                        case 'Account':
                            await User.updateOne({ _id: report.content }, { is_hide: true })

                            return res.status(200).json({
                                status: 200,
                                message: 'success',
                                message: 'success approve report'
                            })

                        case 'Post':
                            await Post.updateOne({ _id: report.content }, { is_hide: true })

                            return res.status(200).json({
                                status: 200,
                                message: 'success',
                                message: 'success approve report'
                            })

                        case 'Discussion':
                            await Discussion.updateOne({ _id: report.content }, { is_hide: true })

                            return res.status(200).json({
                                status: 200,
                                message: 'success',
                                message: 'success approve report'
                            })

                        default:
                            return res.status(401).json({
                                status: 401,
                                message: 'failed',
                                info: `cannot define type`
                            })
                    }
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

const takedown_report = async (req, res, next) => {
    const { id_report } = req.params
    const query = { _id: id_report }
    try {
        const report = await Report.findOne(query)
        if (!report) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: "can't find post"
            })
        } else {
            await Report.deleteOne(query)

            return res.status(200).json({
                status: 200,
                message: `Success Delete report ${id_report}`
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

const controller = {
    create_report,
    get_report_list,
    get_own_report_list,
    get_report_detail,
    approve_report,
    takedown_report
}

export default controller