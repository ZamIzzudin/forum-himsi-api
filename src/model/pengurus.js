import mongoose from "mongoose";

const pengurusSchema = new mongoose.Schema({
    nama_pengurus: String,
    jabatan: String,
    media_social: String,
    foto_pengurus: {
        public_id: String,
        url: String
    },
    id_bidang: {
        type: mongoose.Schema.ObjectId,
        required: true
    }
});

const Pengurus = mongoose.model("Pengurus", pengurusSchema);

export default Pengurus