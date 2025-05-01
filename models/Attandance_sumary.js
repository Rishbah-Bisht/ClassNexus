const mongoose = require('mongoose');

const AttendanceSummarySchema = new mongoose.Schema({
    student: String,
    student_id:Number,
    present: Number,
    total: Number,
    percentage: Number,
    className: String
});

module.exports = mongoose.model('AttendanceSummary', AttendanceSummarySchema);
