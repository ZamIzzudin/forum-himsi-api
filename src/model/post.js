import mongoose from "mongoose";

const post_schema = new mongoose.Schema({
    username: String,
    display_name: String,
    category: Array,
    head: String,
    body: String,
    attachments: Array,
    is_hide: Boolean,
    discusion: Array,
    created_at: {
        type: Date,
        default: new Date()
    },
    updated_at: {
        type: Date,
        default: new Date()
    },
    profile_picture: {
        public_id: String,
        url: String
    },
});

const Post = mongoose.model("Post", post_schema);

export default Post