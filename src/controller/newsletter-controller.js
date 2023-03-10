import mailchimp from "@mailchimp/mailchimp_marketing";
import md5 from 'md5'
import config from '../config/config.js'

const {
    API_KEY_MAILCHIMP,
    ID_AUDIENCE,
    PREFIX_MAILCHIMP
} = config

mailchimp.setConfig({
    apiKey: API_KEY_MAILCHIMP,
    server: PREFIX_MAILCHIMP,
});

async function initialConfig() {
    const response = await mailchimp.ping.get();
    console.log(response);
}

const getAllAudience = async (req, res, next) => {
    try {
        const allAudience = await mailchimp.lists.getAllLists()
        res.status(200).json({
            status: 200,
            message: "success",
            data: allAudience,
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: 500,
            message: "failed",
            info: "server error",
        });
    }
}

const getSpecificAudience = async (req, res, next) => {
    try {
        const audience = await mailchimp.lists.getList(ID_AUDIENCE);
        res.status(200).json({
            status: 200,
            message: "success",
            data: audience,
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: 500,
            message: "failed",
            info: "server error",
        });
    }
}

const getAllMember = async (req, res, next) => {
    try {
        const allMember = await mailchimp.lists.getListMembersInfo(ID_AUDIENCE);
        res.status(200).json({
            status: 200,
            message: "success",
            data: allMember.members,
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: 500,
            message: "failed",
            info: "server error",
        });
    }
}

const getSpecificMember = async (req, res, next) => {
    const { email } = req.body
    try {
        const member = await mailchimp.lists.getListMember(ID_AUDIENCE, md5(email.toLowerCase()));
        res.status(200).json({
            status: 200,
            message: "success",
            data: member,
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: 500,
            message: "failed",
            info: "server error",
        });
    }
}

const createMember = async (req, res, next) => {
    const { email } = req.body
    try {
        const newMember = await mailchimp.lists.addListMember(ID_AUDIENCE, {
            email_address: email,
            status: 'pending'
        });
        res.status(200).json({
            status: 200,
            message: "success",
            data: newMember
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            message: "failed",
            info: "server error",
        });
    }
}

const updateMember = async (req, res, next) => {
    const { email } = req.body
    try {
        const member = await mailchimp.lists.updateListMember(
            ID_AUDIENCE,
            md5(email.toLowerCase()),
            {
                status: "pending"
            }
        );
        res.status(200).json({
            status: 200,
            message: "success",
            data: member
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            message: "failed",
            info: "server error",
        });
    }
}

const deleteMember = async (req, res, next) => {
    const { email } = req.body
    try {
        const member = await mailchimp.lists.updateListMember(
            ID_AUDIENCE,
            md5(email.toLowerCase()),
            {
                status: "unsubscribed"
            }
        );
        res.status(200).json({
            status: 200,
            message: "success",
            data: member
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            message: "failed",
            info: "server error",
        });
    }
}

const successSubcribed = (req, res, next) => {
    res.status(200).json({
        status: 200,
        message: "success",
        info: 'successfully subcribed HIMSI News Letter'
    })
}

const newsLetter = {
    getAllAudience,
    getSpecificAudience,
    getAllMember,
    createMember,
    getSpecificMember,
    updateMember,
    deleteMember,
    successSubcribed
}

export default newsLetter