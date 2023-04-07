import mongoose from "mongoose";

const discussion_schema = new mongoose.Schema({
    created_by: String,
    topic: String,
    body: String,
    layer: [],
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

const Discussion = mongoose.model("Discussion", discussion_schema);

export default Discussion