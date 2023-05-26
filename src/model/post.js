import mongoose from "mongoose";

const post_schema = new mongoose.Schema({
    created_by: String,
    category: String,
    category_text: String,
    body: String,
    attachments: Array,
    link: String,
    likes: {
        type: Array,
        default: []
    },
    is_hide: {
        type: Boolean,
        default: false
    },
    discussion: {
        type: Array,
        default: []
    },
    created_at: {
        type: Date,
        default: new Date()
    },
    updated_at: {
        type: Date,
        default: new Date()
    }
});

const Post = mongoose.model("Post", post_schema);

export default Post