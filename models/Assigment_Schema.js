const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    className: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    dueDate: {
        type: Date,
        required: true
    },
    fileUrl: {
        type: String, // File ka path ya URL save karenge
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
