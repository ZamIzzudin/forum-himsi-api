import mongoose from "mongoose";

const category_schema = new mongoose.Schema({
    name: String,
    posts: {
        type: Number,
        default: 0
    }
});

const Category = mongoose.model("Category", category_schema);

export default Category