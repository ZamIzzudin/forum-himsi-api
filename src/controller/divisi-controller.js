import Divisi from '../model/divisi.js'

const createDivisi = async (req, res, next) => {
    const {
        nama_divisi,
        id_bidang
    } = req.body
    try {
        const newDivisi = await Divisi.create({
            nama_divisi,
            id_bidang
        });
        res.status(200).json({
            status: 200,
            message: 'success',
            data: newDivisi
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

const getDivisi = async (req, res, next) => {
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

        let divisi = await Divisi.aggregate([
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
                    nama_divisi: 1,
                    bidang: '$bidang.nama_bidang'
                }
            }
        ])
        res.status(200).json({
            status: 200,
            message: 'success',
            data: divisi
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

const getDivisiById = async (req, res, next) => {
    const { id } = req.params
    try {
        const divisi = await Divisi.findOne({ _id: id })
        //when id divisi is not found
        if (!divisi) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'divisi not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: divisi
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

const editDivisi = async (req, res, next) => {
    const { id } = req.params
    const {
        nama_divisi,
        id_bidang
    } = req.body
    try {
        const divisi = await Divisi.findOne({ _id: id })
        //when id divisi is not found
        if (!divisi) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'divisi not found'
            });
        }

        await Divisi.updateOne({ _id: id }, {
            $set: {
                nama_divisi,
                id_bidang
            }
        })
        res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully edited divisi'
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

const deleteDivisi = async (req, res, next) => {
    const { id } = req.params
    try {
        const divisi = await Divisi.findOne({ _id: id })
        //when id divisi is not found
        if (!divisi) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'divisi not found'
            });
        }

        const deletedDivisi = await Divisi.deleteOne({ _id: id })
        //when no one divisi is deleted
        if (deletedDivisi.deletedCount === 0) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'divisi not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully deleted divisi'
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

const profileController = {
    createDivisi,
    getDivisi,
    getDivisiById,
    editDivisi,
    deleteDivisi,
}

export default profileController