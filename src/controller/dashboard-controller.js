import Bidang from '../model/bidang.js'

const getBidangDashboard = async (req, res, next) => {
    try {
        let bidang = await Bidang.aggregate([
            {
                $lookup: {
                    from: 'divisis',
                    localField: '_id',
                    foreignField: 'id_bidang',
                    as: 'divisi'
                },
            }, {
                $project: {
                    _id: 1,
                    nama_bidang: 1,
                    kepanjangan_bidang: 1,
                    deskripsi_bidang: 1,
                    logo_bidang: 1,
                    divisi: '$divisi.nama_divisi'
                }
            }
        ])
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

const getPengurusDashboard = async (req, res, next) => {
    try {
        let pengurus = await Bidang.aggregate([
            {
                $lookup: {
                    from: 'divisis',
                    localField: '_id',
                    foreignField: 'id_bidang',
                    as: 'divisi'
                },
            }, {
                $lookup: {
                    from: 'pengurus',
                    localField: '_id',
                    foreignField: 'id_bidang',
                    as: 'pengurus'
                },
            }, {
                $project: {
                    _id: 1,
                    nama_bidang: 1,
                    kepanjangan_bidang: 1,
                    deskripsi_bidang: 1,
                    logo_bidang: 1,
                    divisi: '$divisi.nama_divisi',
                    pengurus: '$pengurus'
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

const dashboardController = {
    getBidangDashboard,
    getPengurusDashboard
}

export default dashboardController