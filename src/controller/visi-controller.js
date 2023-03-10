import fs from 'fs';
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import Himpunan from "../model/himpunan.js"

const saveVisi = async (req, res, next) => {
    const {
        visi,
        misi } = req.body
    try {
        const existingHimpunan = await Himpunan.findOne()
        //when himpunan not already define
        if (!existingHimpunan) {
            await Himpunan.create({
                nama_himpunan: '',
                nama_universitas: '',
                gambar_struktur: '',
                logo_himpunan: '',
            });
        }
        await Himpunan.updateOne({}, {
            $set: {
                visi: visi,
                misi: misi,
            }
        })
        res.status(200).json({
            status: 200,
            message: 'success',
            data: {
                visi,
                misi
            }
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

const getVisi = async (req, res, next) => {
    try {
        const visi = await Himpunan.findOne({})
            .select({
                _id: 1,
                visi: 1,
                misi: 1
            })
        res.status(200).json({
            status: 200,
            message: 'success',
            data: visi
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

const visiController = {
    saveVisi,
    getVisi,
}

export default visiController