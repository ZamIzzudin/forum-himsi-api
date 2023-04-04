import mongoose from "mongoose"

const user_scheme = new mongoose.Schema({
    username: String,
    display_name: String,
    email: String,
    password: String,
    is_hide: {
        type: Boolean,
        default: false
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        default: ""
    },
    pin_post: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    follower: {
        type: Array,
        default: []
    },
    subscription: {
        type: Array,
        default: []
    },
    is_banned: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['SysAdmin', 'Verified', 'Common'],
        default: 'Common'
    },
    profile_picture: {
        public_id: {
            type: String,
            default: "none"
        },
        url: {
            type: String,
            default: "none"
        },
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

const User = mongoose.model("User", user_scheme)

export default User