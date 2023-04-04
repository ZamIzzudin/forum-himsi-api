import mongoose from "mongoose";

const submission_schema = new mongoose.Schema({
    created_by: String,
    email: String,
    contact: String,
    name: String,
    password: String,
    organization: String,
    attachments: Array,
    created_at: {
        type: Date,
        default: new Date()
    },
    updated_at: {
        type: Date,
        default: new Date()
    }
});

const Submission = mongoose.model("Submission", submission_schema);

export default Submission