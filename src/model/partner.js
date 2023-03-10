import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema({
    nama_partner: String,
    logo_partner: {
        public_id: String,
        url: String
    },
});

const Partner = mongoose.model("Partner", partnerSchema);

export default Partner
