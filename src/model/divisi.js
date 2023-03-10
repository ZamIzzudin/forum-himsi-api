import mongoose from "mongoose";

const divisiSchema = new mongoose.Schema({
    nama_divisi: String,
    id_bidang: {
        type: mongoose.Schema.ObjectId,
        required: true
    }
});

const Divisi = mongoose.model("Divisi", divisiSchema);

export default Divisi