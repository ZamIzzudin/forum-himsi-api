import mongoose from 'mongoose';
import Event from "../model/events.js"
import cloudinary from '../libs/cloudinary.js'
import removeImage from '../libs/photos.js';

const createEvent = async (req, res, next) => {
    let {
        judul_event,
        tanggal_mulai_event,
        tanggal_selesai_event,
        status_event,
        kategori_event,
        isi_event,
        penulis_event,
        link_pdf,
        link_pendaftaran,
        id_divisi
    } = req.body

    //when tanggal selesai event is not sent
    if (!tanggal_selesai_event) {
        tanggal_selesai_event = null
    }

    try {
        //when header event and gambar event is not sent
        if (!req.files.header_event || !req.files.gambar_event) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'please upload image'
            });
        }

        const {
            header_event: [{ path: pathHeaderEvent }],
            gambar_event: [{ path: pathGambarEvent }],
        } = req.files

        let pathDokumentasiEvent = []

        //when gambar dokumentasi event is sent
        if (req.files.dokumentasi_event) {
            function uploadGambarDokumentasi(pathDokumentasi) {
                return new Promise((resolve) => {
                    cloudinary.uploader.upload(pathDokumentasi).then(result => {
                        resolve(result)
                    })
                })
            }

            async function pushData(pathGambar) {
                const tempPath = []
                for (const element of pathGambar) {
                    const uploadDokumentasi = await uploadGambarDokumentasi(element.path)
                    tempPath.push({
                        public_id: uploadDokumentasi.public_id,
                        url: uploadDokumentasi.secure_url
                    })
                }
                return tempPath
            }

            const { dokumentasi_event } = req.files
            //make all path dokumentasi event in one array 
            pathDokumentasiEvent = await pushData(dokumentasi_event)
        }

        const uploadHeaderEvent = await cloudinary.uploader.upload(pathHeaderEvent)
        const uploadGambarEvent = await cloudinary.uploader.upload(pathGambarEvent)

        const newEvent = await Event.create({
            judul_event,
            tanggal_mulai_event,
            tanggal_selesai_event,
            status_event,
            kategori_event,
            isi_event,
            penulis_event,
            link_pdf,
            link_pendaftaran,
            header_event: {
                public_id: uploadHeaderEvent.public_id,
                url: uploadHeaderEvent.secure_url
            },
            gambar_event: {
                public_id: uploadGambarEvent.public_id,
                url: uploadGambarEvent.secure_url
            },
            dokumentasi_event: pathDokumentasiEvent,
            id_divisi
        });

        res.status(200).json({
            status: 200,
            message: 'success',
            data: newEvent
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

const getEvent = async (req, res, next) => {
    try {
        let { search, bidang, kategori, status, judul, skip, limit, page } = req.query;
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

        //filter by bidang
        if (bidang) {
            query = {
                ...query,
                'bidang.nama_bidang': {
                    $regex: bidang,
                    $options: "i"
                }
            }
        }

        //filter by kategori event
        if (kategori) {
            query = {
                ...query,
                'kategori_event': {
                    $regex: kategori,
                    $options: "i"
                }
            }
        }

        //filter by status event
        if (status) {
            query = {
                ...query,
                'status_event': {
                    $regex: status,
                    $options: "i"
                }
            }
        }

        //filter by judul event
        if (judul) {
            query = {
                ...query,
                'judul_event': {
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
                    'judul_event': {
                        $regex: search,
                        $options: "i"
                    },
                }, {
                    'isi_event': {
                        $regex: search,
                        $options: "i"
                    },
                }]
            }
        }

        const event = await Event.aggregate([
            {
                $lookup: {
                    from: 'divisis',
                    localField: 'id_divisi',
                    foreignField: '_id',
                    as: 'divisi'
                },
            }, {
                $unwind: '$divisi'
            }, {
                $lookup: {
                    from: 'bidangs',
                    localField: 'divisi.id_bidang',
                    foreignField: '_id',
                    as: 'bidang'
                },
            }, {
                $unwind: '$bidang'
            }, {
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
                    event: [{
                        $skip: (queryPage - 1) * querySkip
                    }, {
                        $limit: queryLimit
                    }, {
                        $project: {
                            _id: 1,
                            judul_event: 1,
                            tanggal_mulai_event: 1,
                            tanggal_selesai_event: 1,
                            status_event: 1,
                            kategori_event: 1,
                            isi_event: 1,
                            penulis_event: 1,
                            link_pdf: 1,
                            link_pendaftaran: 1,
                            header_event: 1,
                            gambar_event: 1,
                            dokumentasi_event: 1,
                            divisi: '$divisi.nama_divisi',
                            bidang: '$bidang.nama_bidang',
                        }
                    }],
                },
            }, {
                $unwind: '$pagination'
            }, {
                $project: {
                    total: '$pagination.total',
                    page: '$pagination.page',
                    event: '$event'
                }
            }
        ])
        res.status(200).json({
            status: 200,
            message: 'success',
            data: event
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

const getEventById = async (req, res, next) => {
    const { id } = req.params
    try {
        const event = await Event.aggregate([
            {
                $lookup: {
                    from: 'divisis',
                    localField: 'id_divisi',
                    foreignField: '_id',
                    as: 'divisi'
                },
            }, {
                $unwind: '$divisi'
            }, {
                $lookup: {
                    from: 'bidangs',
                    localField: 'divisi.id_bidang',
                    foreignField: '_id',
                    as: 'bidang'
                },
            }, {
                $unwind: '$bidang'
            }, {
                $match: { _id: mongoose.Types.ObjectId(id) }
            }, {
                $project: {
                    _id: 1,
                    judul_event: 1,
                    tanggal_mulai_event: 1,
                    tanggal_selesai_event: 1,
                    status_event: 1,
                    kategori_event: 1,
                    isi_event: 1,
                    penulis_event: 1,
                    link_pdf: 1,
                    link_pendaftaran: 1,
                    header_event: 1,
                    gambar_event: 1,
                    dokumentasi_event: 1,
                    divisi: '$divisi.nama_divisi',
                    bidang: '$bidang.nama_bidang',
                }
            }
        ])
        //when id event is not found
        if (event.length === 0) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'event not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: event[0]
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

const editEvent = async (req, res, next) => {
    const { id } = req.params
    let {
        judul_event,
        tanggal_mulai_event,
        tanggal_selesai_event,
        status_event,
        kategori_event,
        isi_event,
        penulis_event,
        link_pdf,
        link_pendaftaran,
        id_divisi
    } = req.body

    let header_event, public_id_header_event, gambar_event, public_id_gambar_event = ''
    let dokumentasi_event = []

    //when tanggal selesai event is not sent
    if (!tanggal_selesai_event) {
        tanggal_selesai_event = null
    }
    try {
        const existingEvent = await Event.findOne({ _id: id })
        //when id event is not found
        if (!existingEvent) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'event not found'
            });
        }

        //when header event is not updated
        if (!req.files.header_event) {
            public_id_header_event = existingEvent.header_event.public_id
            header_event = existingEvent.header_event.url
        }
        //when gambar event is not updated
        if (!req.files.gambar_event) {
            public_id_gambar_event = existingEvent.gambar_event.public_id
            gambar_event = existingEvent.gambar_event.url
        }
        //when dokumentasi event is not updated
        if (!req.files.dokumentasi_event) {
            dokumentasi_event = existingEvent.dokumentasi_event
        }
        //when header event is updated
        if (req.files.header_event) {
            const { header_event: [{ path: pathHeaderEvent }] } = req.files

            //delete old images
            cloudinary.uploader.destroy(existingEvent.header_event.public_id)
                .then(result => console.log(result))
            //removeImage(existingEvent.header_event)

            //save new images
            const uploadHeaderEvent = await cloudinary.uploader.upload(pathHeaderEvent)

            public_id_header_event = uploadHeaderEvent.public_id
            header_event = uploadHeaderEvent.secure_url
        }

        if (req.files.gambar_event) {
            const { gambar_event: [{ path: pathGambarEvent }] } = req.files

            //delete old images
            cloudinary.uploader.destroy(existingEvent.gambar_event.public_id)
                .then(result => console.log(result))
            //removeImage(existingEvent.gambar_event)

            //save new images
            const uploadGambarEvent = await cloudinary.uploader.upload(pathGambarEvent)

            public_id_gambar_event = uploadGambarEvent.public_id
            gambar_event = uploadGambarEvent.secure_url
        }

        if (req.files.dokumentasi_event) {
            //delete old images
            const oldDokumentasiEvent = existingEvent.dokumentasi_event
            if (oldDokumentasiEvent.length > 0) {
                for (const element of oldDokumentasiEvent) {
                    cloudinary.uploader.destroy(element.public_id)
                        .then(result => console.log(result))
                    //removeImage(element.path)
                }
            }

            //save new images
            function uploadGambarDokumentasi(pathDokumentasi) {
                return new Promise((resolve) => {
                    cloudinary.uploader.upload(pathDokumentasi).then(result => {
                        resolve(result)
                    })
                })
            }

            async function pushData(pathGambar) {
                const tempPath = []
                for (const element of pathGambar) {
                    const uploadDokumentasi = await uploadGambarDokumentasi(element.path)
                    tempPath.push({
                        public_id: uploadDokumentasi.public_id,
                        url: uploadDokumentasi.secure_url
                    })
                }
                return tempPath
            }

            const pathDokumentasiEvent = req.files.dokumentasi_event
            //make all path dokumentasi event in one arrray
            dokumentasi_event = await pushData(pathDokumentasiEvent)
        }

        await Event.updateOne({ _id: id }, {
            $set: {
                judul_event,
                tanggal_mulai_event,
                tanggal_selesai_event,
                status_event,
                kategori_event,
                isi_event,
                penulis_event,
                link_pdf,
                link_pendaftaran,
                header_event: {
                    public_id: public_id_header_event,
                    url: header_event
                },
                gambar_event: {
                    public_id: public_id_gambar_event,
                    url: gambar_event
                },
                dokumentasi_event: dokumentasi_event,
                id_divisi
            }
        })
        return res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully edited event'
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

const deleteEvent = async (req, res, next) => {
    const { id } = req.params
    try {
        const existingEvent = await Event.findOne({ _id: id })
        //when id event is not found
        if (!existingEvent) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'event not found'
            });
        }

        //delete images
        cloudinary.uploader.destroy(existingEvent.header_event.public_id)
            .then(result => console.log(result))
        cloudinary.uploader.destroy(existingEvent.gambar_event.public_id)
            .then(result => console.log(result))
        if (existingEvent.dokumentasi_event.length > 0) {
            const { dokumentasi_event } = existingEvent
            for (const element of dokumentasi_event) {
                cloudinary.uploader.destroy(element.public_id).then(result => console.log(result))
            }
        }

        // removeImage(existingEvent.header_event)
        // removeImage(existingEvent.gambar_event)
        // if (existingEvent.dokumentasi_event.length > 0) {
        //     const { dokumentasi_event } = existingEvent
        //     for (const element of dokumentasi_event) {
        //         removeImage(existingEvent.element.path)
        //     }
        // }

        const deletedEvent = await Event.deleteOne({ _id: id })
        //when no one event is deleted
        if (deletedEvent.deletedCount === 0) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'event not found'
            });
        }
        return res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully deleted event'
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const eventController = {
    createEvent,
    getEvent,
    getEventById,
    editEvent,
    deleteEvent,
}

export default eventController