const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true},
    fatherName: String,
    dob: String,
    role: { type: String, enum: ['student', 'teacher', 'admin'], required: true },
    password: {
        type: String,
        default: ""
    },
    // Student specific

    Registration_Id: {
        type: Number,
        unique: true,
        sparse: true
    },
    singUp: {
        type: String,
        default:'no'
    },

    class: String,

    // Teacher specific
    department: String,

    subject: String,
    ClassTeacher:String,
    qualification: String,
    experience: Number,
    address: String,
    about: String
});

module.exports = mongoose.model('User', userSchema);

