import mongoose from "mongoose";

const report_schema = new mongoose.Schema({
    created_by: String,
    status: {
        type: String,
        default: 'Submitted'
    },
    type: {
        type: String,
        enum: ['Account', 'Post', 'Discussion'],
    },
    reason: String,
    content: String,
    created_at: {
        type: Date,
        default: new Date()
    },
    updated_at: {
        type: Date,
        default: new Date()
    }
});

const Report = mongoose.model("Report", report_schema);

export default Report