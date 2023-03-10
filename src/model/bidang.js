import mongoose from "mongoose";

const bidangSchema = new mongoose.Schema({
    nama_bidang: String,
    kepanjangan_bidang: String,
    deskripsi_bidang: String,
    logo_bidang: {
        public_id: String,
        url: String
    }
});

const Bidang = mongoose.model("Bidang", bidangSchema);

export default Bidang