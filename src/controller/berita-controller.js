import Berita from "../model/berita.js"
import cloudinary from '../libs/cloudinary.js';
import removeImage from "../libs/photos.js";

const createBerita = async (req, res, next) => {
    const {
        judul_berita,
        kategori_berita,
        isi_berita,
        penulis_berita,
        link_pdf,
        link_berita
    } = req.body
    try {
        //when header berita and gambar berita is not sent
        if (!req.files.header_berita || !req.files.gambar_berita) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'please upload image'
            });
        }
        const {
            header_berita: [{ path: pathHeaderBerita }],
            gambar_berita: [{ path: pathGambarBerita }]
        } = req.files

        //upload image
        const uploadHeaderBerita = await cloudinary.uploader.upload(pathHeaderBerita)
        const uploadGambarBerita = await cloudinary.uploader.upload(pathGambarBerita)

        const newBerita = await Berita.create({
            judul_berita,
            kategori_berita,
            isi_berita,
            penulis_berita,
            link_pdf,
            link_berita,
            header_berita: {
                public_id: uploadHeaderBerita.public_id,
                url: uploadHeaderBerita.secure_url
            },
            gambar_berita: {
                public_id: uploadGambarBerita.public_id,
                url: uploadGambarBerita.secure_url
            },
        });

        res.status(200).json({
            status: 200,
            message: 'success',
            data: newBerita
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

const getBerita = async (req, res, next) => {
    try {
        let { search, kategori, judul, skip, limit, page } = req.query;
        let query = {}

        //pagination
        let querySkip = 0
        let queryLimit = 8
        let queryPage = 1
        if (skip) {
            querySkip = Number(skip)
        }
        if (limit) {
            queryLimit = Number(limit)
        }
        if (page) {
            queryPage = Number(page)
        }

        //filter by kategori
        if (kategori) {
            query = {
                ...query,
                'kategori_berita': {
                    $in: [kategori]
                }
            }
        }

        //filter by judul
        if (judul) {
            query = {
                ...query,
                'judul_berita': {
                    $regex: judul,
                    $options: "i"
                }
            }
        }

        //filter by search keyword
        if (search) {
            query = {
                ...query,
                $or: [{
                    'judul_berita': {
                        $regex: search,
                        $options: "i"
                    },
                }, {
                    'isi_berita': {
                        $regex: search,
                        $options: "i"
                    },
                }]
            }
        }

        let berita = await Berita.aggregate([
            {
                $match: query
            }, {
                $sort: {
                    _id: -1
                }
            }, {
                $facet: {
                    pagination: [{
                        $count: "total"
                    }, {
                        $addFields: { page: queryPage }
                    }],
                    berita: [{
                        $skip: (queryPage - 1) * querySkip
                    }, {
                        $limit: queryLimit
                    }],
                },
            }, {
                $unwind: '$pagination'
            }, {
                $project: {
                    total: '$pagination.total',
                    page: '$pagination.page',
                    berita: '$berita'
                }
            }
        ])

        res.status(200).json({
            status: 200,
            message: 'success',
            data: berita
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

const getBeritaById = async (req, res, next) => {
    const { id } = req.params
    try {
        //find berita by id
        const berita = await Berita.findOne({ _id: id })
        //when id berita is not found
        if (!berita) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'berita not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: berita
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


const editBerita = async (req, res, next) => {
    const { id } = req.params
    const {
        judul_berita,
        kategori_berita,
        isi_berita,
        penulis_berita,
        link_pdf,
        link_berita,
    } = req.body

    let header_berita, public_id_header_berita, gambar_berita, public_id_gambar_berita = ''

    try {
        //find berita by id
        const existingBerita = await Berita.findOne({ _id: id })
        //when id berita is not found
        if (!existingBerita) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'berita not found'
            });
        }

        //when gambar berita not updated
        if (!req.files.gambar_berita) {
            //set value gambar berita with old image
            gambar_berita = existingBerita.gambar_berita.url
            public_id_gambar_berita = existingBerita.gambar_berita.public_id
        }

        //when header berita not updated
        if (!req.files.header_berita) {
            //set value header berita with old image
            header_berita = existingBerita.header_berita.url
            public_id_header_berita = existingBerita.header_berita.public_id
        }

        //when header berita is updated
        if (req.files.header_berita) {
            const { header_berita: [{ path: pathHeaderBerita }] } = req.files

            //delete old images
            cloudinary.uploader.destroy(existingBerita.header_berita.public_id)
                .then(result => console.log(result))
            //removeImage(existingBerita.header_berita)

            //save new images
            const uploadHeaderBerita = await cloudinary.uploader.upload(pathHeaderBerita)

            //set value header berita with new image
            header_berita = uploadHeaderBerita.secure_url
            public_id_header_berita = uploadHeaderBerita.public_id
        }

        //when gambar berita is updated
        if (req.files.gambar_berita) {
            const { gambar_berita: [{ path: pathGambarBerita }] } = req.files

            //delete old images
            cloudinary.uploader.destroy(existingBerita.gambar_berita.public_id)
                .then(result => console.log(result))
            //removeImage(existingBerita.gambar_berita)

            //save new images
            const uploadGambarBerita = await cloudinary.uploader.upload(pathGambarBerita)

            //set value gambar berita with new image
            gambar_berita = uploadGambarBerita.secure_url
            public_id_gambar_berita = uploadGambarBerita.public_id
        }

        await Berita.updateOne({ _id: id }, {
            $set: {
                judul_berita,
                kategori_berita,
                isi_berita,
                penulis_berita,
                link_pdf,
                link_berita,
                header_berita: {
                    public_id: public_id_header_berita,
                    url: header_berita
                },
                gambar_berita: {
                    public_id: public_id_gambar_berita,
                    url: gambar_berita
                },
            }
        })
        return res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully edited berita'
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

const deleteBerita = async (req, res, next) => {
    const { id } = req.params
    try {
        //find berita by id
        const berita = await Berita.findOne({ _id: id })
        //when id berita is not found
        if (!berita) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'berita not found'
            });
        }

        //delete image
        cloudinary.uploader.destroy(berita.header_berita.public_id)
            .then(result => console.log(result))
        cloudinary.uploader.destroy(berita.gambar_berita.public_id)
            .then(result => console.log(result))
        // removeImage(berita.header_berita)
        // removeImage(berita.gambar_berita)

        const deletedBerita = await Berita.deleteOne({ _id: id })
        //when no one berita is deleted
        if (deletedBerita.deletedCount === 0) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'berita not found'
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully deleted berita'
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

const categoryBerita = async (req, res, next) => {
    let listKategori = []
    try {
        //find berita by id
        const berita = await Berita.find()

        //when berita is empty
        if (!berita) {
            return res.status(200).json({
                status: 200,
                message: 'success',
                data: listKategori
            })
        }

        //push all kategori in one variable
        for (const element of berita) {
            listKategori.push(...element.kategori_berita)
        }

        //distict category berita
        let uniqueKategori = Array.from(new Set(listKategori))

        return res.status(200).json({
            status: 200,
            message: 'success',
            data: uniqueKategori
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

const beritaController = {
    createBerita,
    getBerita,
    getBeritaById,
    editBerita,
    deleteBerita,
    categoryBerita
}

export default beritaController