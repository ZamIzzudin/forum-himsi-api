import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema({
    gambar_slider: {
        public_id: String,
        url: String
    },
    judul_slider: String,
});

const Slider = mongoose.model("Slider", sliderSchema);

export default Slider