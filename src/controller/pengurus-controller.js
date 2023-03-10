import Pengurus from "../model/pengurus.js"
import cloudinary from '../libs/cloudinary.js'
import removeImage from "../libs/photos.js"

const createPengurus = async (req, res, next) => {
    const {
        nama_pengurus,
        jabatan,
        media_social,
        id_bidang
    } = req.body
    try {
        //when foto pengurus is not sent
        if (!req.file) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'please upload image'
            });
        }

        const { path: pathFotoPengurus } = req.file
        const uploadFotoPengurus = await cloudinary.uploader.upload(pathFotoPengurus)

        const newPengurus = await Pengurus.create({
            nama_pengurus,
            jabatan,
            media_social,
            id_bidang,
            foto_pengurus: {
                public_id: uploadFotoPengurus.public_id,
                url: uploadFotoPengurus.secure_url
            }
        });
        res.status(200).json({
            status: 200,
            message: 'success',
            data: newPengurus
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

const getPengurus = async (req, res, next) => {
    try {
        let { bidang } = req.query;
        let query = {}

        //filter by bidang
        if (bidang) {
            query = {
                'bidang.nama_bidang': {
                    $regex: bidang,
                    $options: "i"
                }
            }
        }

        let pengurus = await Pengurus.aggregate([
            {
                $lookup: {
                    from: 'bidangs',
                    localField: 'id_bidang',
                    foreignField: '_id',
                    as: 'bidang'
                },
            }, {
                $unwind: '$bidang'
            }, {
                $match: query
            }, {
                $project: {
                    _id: 1,
                    nama_pengurus: 1,
                    jabatan: 1,
                    media_social: 1,
                    foto_pengurus: 1,
                    bidang: '$bidang.nama_bidang'
                }
            }
        ])
        res.status(200).json({
            status: 200,
            message: 'success',
            data: pengurus
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

const getPengurusById = async (req, res, next) => {
    const { id } = req.params
    try {
        const pengurus = await Pengurus.findOne({ _id: id })
        //when id pengurus is not found
        if (!pengurus) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'pengurus not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: pengurus
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


const editPengurus = async (req, res, next) => {
    const { id } = req.params
    const {
        nama_pengurus,
        jabatan,
        media_social,
        id_bidang
    } = req.body

    let foto_pengurus, public_id_foto_pengurus = ''

    try {
        const existingPengurus = await Pengurus.findOne({
            _id: id
        })
        //when id partner is not found
        if (!existingPengurus) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'pengurus not found'
            });
        }

        //when foto pengurus not updated
        if (!req.file) {
            foto_pengurus = existingPengurus.foto_pengurus.url
            public_id_foto_pengurus = existingPengurus.foto_pengurus.public_id
        }
        //when foto pengurus is updated
        if (req.file) {
            const { path: pathFotoPengurus } = req.file

            //delete old images
            cloudinary.uploader.destroy(existingPengurus.foto_pengurus.public_id)
                .then(result => console.log(result))
            //removeImage(existingPengurus.foto_pengurus)

            //save new images
            const uploadFotoPengurus = await cloudinary.uploader.upload(pathFotoPengurus)

            foto_pengurus = uploadFotoPengurus.secure_url
            public_id_foto_pengurus = uploadFotoPengurus.public_id
        }

        await Pengurus.updateOne({
            _id: id
        }, {
            $set: {
                nama_pengurus,
                jabatan,
                media_social,
                id_bidang,
                foto_pengurus: {
                    public_id: public_id_foto_pengurus,
                    url: foto_pengurus
                },
            }
        })
        return res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully edited pengurus'
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

const deletePengurus = async (req, res, next) => {
    const { id } = req.params
    try {
        const pengurus = await Pengurus.findOne({ _id: id })
        //when id pengurus is not found
        if (!pengurus) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'pengurus not found'
            });
        }

        //delete image
        cloudinary.uploader.destroy(pengurus.foto_pengurus.public_id)
            .then(result => console.log(result))
        //removeImage(pengurus.foto_pengurus)

        const deletedPengurus = await Pengurus.deleteOne({ _id: id })
        //when no one pengurus is deleted
        if (deletedPengurus.deletedCount === 0) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'pengurus not found'
            });
        }
        return res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully deleted pengurus'
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

const pengurusController = {
    createPengurus,
    getPengurus,
    getPengurusById,
    editPengurus,
    deletePengurus,
}

export default pengurusController