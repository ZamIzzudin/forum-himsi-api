import Partner from "../model/partner.js";
import cloudinary from '../libs/cloudinary.js'
import removeImage from "../libs/photos.js";

const getPartner = async (req, res, next) => {
    try {
        const partner = await Partner.find();
        res.status(200).json({
            status: 200,
            message: "success",
            data: partner,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: 500,
            message: "failed",
            info: "server error",
        });
    }
};

const getPartnerById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const partner = await Partner.findOne({ _id: id });
        //when id partner is not found
        if (!partner) {
            return res.status(400).json({
                status: 400,
                message: "failed",
                info: "partner not found",
            });
        }
        res.status(200).json({
            status: 200,
            message: "success",
            data: partner,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: 500,
            message: "failed",
            info: "server error",
        });
    }
};

const createPartner = async (req, res, next) => {
    const { nama_partner } = req.body;
    try {
        //when logo partner is not sent
        if (!req.file) {
            return res.status(400).json({
                status: 400,
                message: "failed",
                info: "please upload partner logo image",
            });
        }

        const { path: pathLogoPartner } = req.file
        const uploadLogoPartner = await cloudinary.uploader.upload(pathLogoPartner)

        const newPartner = await Partner.create({
            nama_partner,
            logo_partner: {
                public_id: uploadLogoPartner.public_id,
                url: uploadLogoPartner.secure_url
            }
        });
        res.status(200).json({
            status: 200,
            message: "success",
            data: newPartner,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: 500,
            message: "failed",
            info: "server error",
        });
    }
};

const editPartner = async (req, res, next) => {
    const { id } = req.params
    const { nama_partner } = req.body
    let logo_partner, public_id_logo_partner = ''
    try {
        const existingPartner = await Partner.findOne({ _id: id })
        //when id partner is not found
        if (!existingPartner) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'partner not found'
            });
        }

        //when logo partner not updated
        if (!req.file) {
            logo_partner = existingPartner.logo_partner.url
            public_id_logo_partner = existingPartner.logo_partner.public_id
        }
        //when logo partner is updated
        if (req.file) {
            const { path: pathLogoPartner } = req.file

            //delete old images
            cloudinary.uploader.destroy(existingPartner.logo_partner.public_id)
                .then(result => console.log(result))
            //removeImage(existingPartner.logo_partner)

            //save new images
            const uploadLogoPartner = await cloudinary.uploader.upload(pathLogoPartner)

            logo_partner = uploadLogoPartner.secure_url
            public_id_logo_partner = uploadLogoPartner.public_id
        }

        await Partner.updateOne({ _id: id }, {
            $set: {
                nama_partner,
                logo_partner: {
                    public_id: public_id_logo_partner,
                    url: logo_partner
                }
            }
        })
        res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully edited partner'
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

const deletePartner = async (req, res, next) => {
    const { id } = req.params
    try {
        const partner = await Partner.findOne({ _id: id })
        //when id partner is not found
        if (!partner) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'partner data not found'
            });
        }

        //delete image
        cloudinary.uploader.destroy(partner.logo_partner.public_id)
            .then(result => console.log(result))
        //removeImage(partner.logo_partner)

        const deletedPartner = await Partner.deleteOne({ _id: id })
        if (deletedPartner.deletedCount === 0) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'partner not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully deleted partner'
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const partnerController = {
    createPartner,
    getPartner,
    getPartnerById,
    editPartner,
    deletePartner,
}

export default partnerController


