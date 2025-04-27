const mongoose = require('mongoose');

const AttendanceSummarySchema = new mongoose.Schema({
    student: String,
    present: Number,
    total: Number,
    percentage: Number,
    className: String
});

module.exports = mongoose.model('AttendanceSummary', AttendanceSummarySchema);
