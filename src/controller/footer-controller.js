import Footer from '../model/footer.js'

const createFooter = async (req, res, next) => {
    const {
        alamat,
        email,
        website
    } = req.body
    try {
        const newFooter = await Footer.create({
            alamat,
            email,
            website
        });
        res.status(200).json({
            status: 200,
            message: 'success',
            data: newFooter
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const getFooter = async (req, res, next) => {
    try {
        const footer = await Footer.find()
        res.status(200).json({
            status: 200,
            message: 'success',
            data: footer
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const getFooterById = async (req, res, next) => {
    const { id } = req.params
    try {
        const footer = await Footer.findOne({ _id: id })
        //when id footer is not found
        if (!footer) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'footer not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: footer
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const editFooter = async (req, res, next) => {
    const { id } = req.params
    const {
        alamat,
        email,
        website } = req.body
    try {
        const footer = await Footer.findOne({ _id: id })
        //when id footer is not found
        if (!footer) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'footer not found'
            });
        }

        await Footer.updateOne({ _id: id }, {
            $set: {
                alamat,
                email,
                website
            }
        })
        res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully edited footer'
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const deleteFooter = async (req, res, next) => {
    const { id } = req.params
    try {
        const footer = await Footer.findOne({ _id: id })
        //when id footer is not found
        if (!footer) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'footer not found'
            });
        }

        const deletedFooter = await Footer.deleteOne({ _id: id })
        //when no one footer is deleted
        if (deletedFooter.deletedCount === 0) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'footer not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully deleted footer'
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const footerController = {
    createFooter,
    getFooter,
    getFooterById,
    editFooter,
    deleteFooter,
}

export default footerController