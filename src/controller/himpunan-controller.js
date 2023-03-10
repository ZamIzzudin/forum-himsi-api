import Himpunan from "../model/himpunan.js"
import cloudinary from '../libs/cloudinary.js';
import removeImage from "../libs/photos.js";

const saveHimpunan = async (req, res, next) => {
    const {
        nama_himpunan,
        nama_universitas
    } = req.body

    let logo_himpunan, public_id_logo_himpunan, gambar_struktur, public_id_gambar_struktur = ''

    try {
        const existingHimpunan = await Himpunan.findOne()
        //when himpunan not already define
        if (!existingHimpunan) {
            await Himpunan.create({
                nama_himpunan,
                nama_universitas,
                gambar_struktur: '',
                logo_himpunan: '',
            });
        }
        //when gambar struktur is not updated
        if (!req.files.gambar_struktur) {
            gambar_struktur = existingHimpunan.gambar_struktur.url
            public_id_gambar_struktur = existingHimpunan.gambar_struktur.public_id
        }
        //when gambar struktur is not updated
        if (!req.files.logo_himpunan) {
            logo_himpunan = existingHimpunan.logo_himpunan.url
            public_id_logo_himpunan = existingHimpunan.logo_himpunan.public_id
        }
        //when gambar struktur is updated
        if (req.files.gambar_struktur) {
            const { gambar_struktur: [{ path: pathGambarStruktur }] } = req.files

            //delete old images
            cloudinary.uploader.destroy(existingHimpunan.gambar_struktur.public_id)
                .then(result => console.log(result))
            //removeImage(existingHimpunan.gambar_struktur)

            //upload gambar struktur
            const uploadGambarStruktur = await cloudinary.uploader.upload(pathGambarStruktur)

            //set value gambar struktur with new image
            gambar_struktur = uploadGambarStruktur.secure_url
            public_id_gambar_struktur = uploadGambarStruktur.public_id
        }
        //when gambar struktur is updated
        if (req.files.logo_himpunan) {
            const { logo_himpunan: [{ path: pathLogoHimpunan }] } = req.files

            //delete old images
            cloudinary.uploader.destroy(existingHimpunan.logo_himpunan.public_id)
                .then(result => console.log(result))
            //removeImage(existingHimpunan.logo_himpunan)

            //upload logo himpunan
            const uploadLogoHimpunan = await cloudinary.uploader.upload(pathLogoHimpunan)

            logo_himpunan = uploadLogoHimpunan.secure_url
            public_id_logo_himpunan = uploadLogoHimpunan.public_id
        }

        await Himpunan.updateOne({}, {
            $set: {
                nama_himpunan,
                nama_universitas,
                gambar_struktur: {
                    public_id: public_id_gambar_struktur,
                    url: gambar_struktur
                },
                logo_himpunan: {
                    public_id: public_id_logo_himpunan,
                    url: logo_himpunan
                },
            }
        })
        return res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully save himpunan'
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

const getHimpunan = async (req, res, next) => {
    try {
        const himpunan = await Himpunan.findOne({})
            .select({
                _id: 1,
                nama_himpunan: 1,
                nama_universitas: 1,
                logo_himpunan: 1,
                gambar_struktur: 1
            })
        return res.status(200).json({
            status: 200,
            message: 'success',
            data: himpunan
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

const deleteHimpunan = async (req, res, next) => {
    const { id } = req.params
    try {
        const himpunan = await Himpunan.findOne({ _id: id })
        //when id himpunan is not found
        if (!himpunan) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'himpunan not found'
            });
        }

        //delete gambar struktur when exist
        if (himpunan.gambar_struktur) {
            //delete old images
            cloudinary.uploader.destroy(himpunan.gambar_struktur.public_id)
                .then(result => console.log(result))
            //removeImage(himpunan.gambar_struktur)
        }
        //delete logo himpunan when exist
        if (himpunan.logo_himpunan) {
            //delete old images
            cloudinary.uploader.destroy(himpunan.logo_himpunan.public_id)
                .then(result => console.log(result))
            //removeImage(himpunan.logo_himpunan)
        }

        await Himpunan.deleteOne({ _id: id })
        return res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully deleted himpunan'
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

const himpunanController = {
    saveHimpunan,
    getHimpunan,
    deleteHimpunan,
}

export default himpunanController