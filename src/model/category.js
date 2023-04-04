import mongoose from "mongoose";

const category_schema = new mongoose.Schema({
    categories: {
        type: Array,
        default: []
    }
});

const Category = mongoose.model("Category", category_schema);

export default Category