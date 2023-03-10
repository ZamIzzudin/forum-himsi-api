import mongoose from "mongoose";

const footerSchema = new mongoose.Schema({
    alamat: String,
    email: String,
    website: String
});

const Footer = mongoose.model("Footer", footerSchema);

export default Footer
