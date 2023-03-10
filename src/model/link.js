import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
    nama_link: String,
    url: String,
    kategori: String
});

const Link = mongoose.model("Link", linkSchema);

export default Link;