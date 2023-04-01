import mongoose from "mongoose";

const post_schema = new mongoose.Schema({
    created_by: String,
    category: Array,
    head: String,
    body: String,
    attachments: Array,
    likes: {
        type: Array,
        default: []
    },
    is_hide: {
        type: Boolean,
        default: false
    },
    discusion: {
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