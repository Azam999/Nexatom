const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    githubUsername: {
        type: String,
        required: true
    },
    stackoverflowUrl: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    timezone: {
        type: String,
        required: true
    },
    languages: {
        type: Array,
        required: true
    },
    majors: {
        type: Array,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

const User = mongoose.model('User', UserSchema);
module.exports = User;