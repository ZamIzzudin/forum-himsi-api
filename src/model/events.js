import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    judul_event: String,
    tanggal_mulai_event: Date,
    tanggal_selesai_event: Date,
    status_event: {
        type: String,
        enum: ['Upcoming', 'On Going', 'Done']
    },
    kategori_event: {
        type: String,
        enum: ['Eksternal HIMSI', 'Internal HIMSI']
    },
    isi_event: String,
    penulis_event: String,
    link_pdf: String,
    link_pendaftaran: String,
    header_event: {
        public_id: String,
        url: String
    },
    gambar_event: {
        public_id: String,
        url: String
    },
    dokumentasi_event: [{
        public_id: String,
        url: String
    }],
    id_divisi: {
        type: mongoose.Schema.ObjectId,
        required: true
    }
});

const Event = mongoose.model("Event", eventSchema);

export default Event