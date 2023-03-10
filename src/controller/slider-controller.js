import Slider from "../model/slider-information.js"
import cloudinary from '../libs/cloudinary.js'
import removeImage from "../libs/photos.js"

const createSlider = async (req, res, next) => {
    const { judul_slider } = req.body
    try {
        //when gambar slider is not sent
        if (!req.file) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'please upload image'
            });
        }

        const { path: pathSlider } = req.file
        const updloadGambarSlider = await cloudinary.uploader.upload(pathSlider)

        const newSlider = await Slider.create({
            judul_slider,
            gambar_slider: {
                public_id: updloadGambarSlider.public_id,
                url: updloadGambarSlider.secure_url
            }
        });
        res.status(200).json({
            status: 200,
            message: 'success',
            data: newSlider
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

const getSlider = async (req, res, next) => {
    try {
        const slider = await Slider.find()
        res.status(200).json({
            status: 200,
            message: 'success',
            data: slider
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

const getSliderById = async (req, res, next) => {
    const { id } = req.params
    try {
        const slider = await Slider.findOne({ _id: id })
        //when id slider is not found
        if (!slider) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'slider not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: slider
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


const editSlider = async (req, res, next) => {
    const { id } = req.params
    const { judul_slider } = req.body

    let gambar_slider, public_id_gambar_slider = ''

    try {
        const existingSlider = await Slider.findOne({ _id: id })
        //when id slider is not found
        if (!existingSlider) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'slider not found'
            });
        }

        //when gambar slider not updated
        if (!req.file) {
            gambar_slider = existingSlider.gambar_slider.url
            public_id_gambar_slider = existingSlider.gambar_slider.public_id
        }
        //when gambar slider is updated
        if (req.file) {
            const { path: pathSlider } = req.file

            //delete old images
            cloudinary.uploader.destroy(existingSlider.gambar_slider.public_id)
                .then(result => console.log(result))
            //removeImage(existingSlider.gambar_slider)

            //save new images
            const uploadGambarSlider = await cloudinary.uploader.upload(pathSlider)

            gambar_slider = uploadGambarSlider.secure_url
            public_id_gambar_slider = uploadGambarSlider.public_id
        }

        await Slider.updateOne({ _id: id }, {
            $set: {
                judul_slider: judul_slider,
                gambar_slider: {
                    public_id: public_id_gambar_slider,
                    url: gambar_slider
                }
            }
        })
        res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully edited slider information'
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

const deleteSlider = async (req, res, next) => {
    const { id } = req.params
    try {
        const slider = await Slider.findOne({ _id: id })
        //when slider is not found
        if (!slider) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'slider not found'
            });
        }

        //deleted image
        cloudinary.uploader.destroy(slider.gambar_slider.public_id)
            .then(result => console.log(result))
        //removeImage(slider.gambar_slider)


        const deletedSlider = await Slider.deleteOne({ _id: id })
        //when no one slider is deleted
        if (deletedSlider.deletedCount === 0) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'slider not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully deleted slider information'
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const sliderController = {
    createSlider,
    getSlider,
    getSliderById,
    editSlider,
    deleteSlider,
}

export default sliderController