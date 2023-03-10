import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
    pertanyaan: String,
    jawaban: String,
});

const FAQ = mongoose.model("FAQ", faqSchema);

export default FAQ
