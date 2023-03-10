import mongoose from "mongoose";

const himpunanSchema = new mongoose.Schema({
    nama_himpunan: String,
    nama_universitas: String,
    logo_himpunan: {
        public_id: String,
        url: String
    },
    gambar_struktur: {
        public_id: String,
        url: String
    },
    visi: String,
    misi: Array
});

const Himpunan = mongoose.model("Himpunan", himpunanSchema);

export default Himpunan
