const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name: String,
    fatherName: String,
    email: String,
    dob: Date,
    department: String,
    subject: String,
    qualification: String,
    experience: Number,
    address: String,
    about: String,
    role: { type: String, default: 'teacher' }
});

module.exports = mongoose.model('Teacher', teacherSchema);
