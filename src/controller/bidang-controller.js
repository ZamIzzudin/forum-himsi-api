import Bidang from "../model/bidang.js"
import cloudinary from '../libs/cloudinary.js'
import removeImage from "../libs/photos.js"

const createBidang = async (req, res, next) => {
    const {
        nama_bidang,
        kepanjangan_bidang,
        deskripsi_bidang
    } = req.body
    try {
        //when logo bidang is not sent
        if (!req.file) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'please upload image'
            });
        }

        const { path: pathLogoBidang } = req.file

        //upload logo bidang
        const uploadLogoBidang = await cloudinary.uploader.upload(pathLogoBidang)

        const newBidang = await Bidang.create({
            nama_bidang,
            kepanjangan_bidang,
            deskripsi_bidang,
            logo_bidang: {
                public_id: uploadLogoBidang.public_id,
                url: uploadLogoBidang.secure_url
            }
        });

        res.status(200).json({
            status: 200,
            message: 'success',
            data: newBidang
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

const getBidang = async (req, res, next) => {
    try {
        let bidang = await Bidang.find()
        res.status(200).json({
            status: 200,
            message: 'success',
            data: bidang
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

const getBidangById = async (req, res, next) => {
    const { id } = req.params
    try {
        const bidang = await Bidang.findOne({ _id: id })
        //when id bidang is not found
        if (!bidang) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'bidang not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: bidang
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


const editBidang = async (req, res, next) => {
    const { id } = req.params
    const {
        nama_bidang,
        kepanjangan_bidang,
        deskripsi_bidang
    } = req.body

    let logo_bidang, public_id_logo_bidang = ''

    try {
        const existingBidang = await Bidang.findOne({ _id: id })
        //when id bidang is not found
        if (!existingBidang) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'bidang not found'
            });
        }

        //when logo bidang not updated
        if (!req.file) {
            //set value logo bidang with old image
            logo_bidang = existingBidang.logo_bidang.url
            public_id_logo_bidang = existingBidang.logo_bidang.public_id
        }

        //when logo bidang is updated
        if (req.file) {
            const { path: pathLogoBidang } = req.file

            //delete old images
            cloudinary.uploader.destroy(existingBidang.logo_bidang.public_id)
                .then(result => console.log(result))
            // removeImage(existingBidang.logo_bidang)

            //save new images
            const uploadLogoBidang = await cloudinary.uploader.upload(pathLogoBidang)

            //set value logo bidang with new image
            logo_bidang = uploadLogoBidang.secure_url
            public_id_logo_bidang = uploadLogoBidang.public_id
        }

        await Bidang.updateOne({ _id: id }, {
            $set: {
                nama_bidang,
                kepanjangan_bidang,
                deskripsi_bidang,
                logo_bidang: {
                    public_id: public_id_logo_bidang,
                    url: logo_bidang
                },
            }
        })
        return res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully edited bidang'
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

const deleteBidang = async (req, res, next) => {
    const { id } = req.params
    try {
        const bidang = await Bidang.findOne({ _id: id })
        //when id bidang is not found
        if (!bidang) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'bidang not found'
            });
        }

        //delete image
        cloudinary.uploader.destroy(bidang.logo_bidang.public_id)
            .then(result => console.log(result))
        // removeImage(bidang.logo_bidang)

        const deletedBidang = await Bidang.deleteOne({ _id: id })
        //when no one bidang is deleted
        if (deletedBidang.deletedCount === 0) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'bidang not found'
            });
        }
        return res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully deleted bidang'
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

const bidangController = {
    createBidang,
    getBidang,
    getBidangById,
    editBidang,
    deleteBidang,
}

export default bidangController