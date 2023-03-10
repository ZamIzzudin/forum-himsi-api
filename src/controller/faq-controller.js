import Faq from '../model/faq.js'

const createFaq = async (req, res, next) => {
    const {
        pertanyaan,
        jawaban } = req.body
    try {
        const newFaq = await Faq.create({
            pertanyaan,
            jawaban
        });
        res.status(200).json({
            status: 200,
            message: 'success',
            data: newFaq
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

const getFaq = async (req, res, next) => {
    try {
        const faq = await Faq.find()
        res.status(200).json({
            status: 200,
            message: 'success',
            data: faq
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

const getFaqById = async (req, res, next) => {
    const { id } = req.params
    try {
        const faq = await Faq.findOne({ _id: id })
        //when id faq is not found
        if (!faq) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'faq not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: faq
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

const editFaq = async (req, res, next) => {
    const { id } = req.params
    const {
        pertanyaan,
        jawaban } = req.body
    try {
        const faq = await Faq.findOne({ _id: id })
        //when id faq is not found
        if (!faq) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'faq not found'
            });
        }

        await Faq.updateOne({ _id: id }, {
            $set: {
                pertanyaan,
                jawaban
            }
        })
        res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully edited faq'
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

const deleteFaq = async (req, res, next) => {
    const { id } = req.params
    try {
        const faq = await Faq.findOne({ _id: id })
        //when id faq is not found
        if (!faq) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'faq not found'
            });
        }

        const deletedFaq = await Faq.deleteOne({ _id: id })
        //when no one faq is deleted
        if (deletedFaq.deletedCount === 0) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'faq not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully deleted faq'
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

const faqController = {
    createFaq,
    getFaq,
    getFaqById,
    editFaq,
    deleteFaq,
}

export default faqController