const AttendanceSummary = require('../models/Attandance_sumary'); // model ka path theek rakhna
const Attendance = require("../models/Attandance"); 
async function calculateAttendanceSummaryAndSave(className) {
    await AttendanceSummary.deleteMany({ className: className });
    const result = await Attendance.aggregate([
        { $match: { class: className } },
        { $unwind: "$students" },
        {
            $group: {
                _id: "$students.student_Name",
                present: {
                    $sum: { $cond: [{ $eq: ["$students.status", "Present"] }, 1, 0] }
                },
                total: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                student: "$_id",
                present: 1,
                total: 1,
                percentage: {
                    $round: [{ $multiply: [{ $divide: ["$present", "$total"] }, 100] }, 2]
                }
            }
        },
        { $sort: { percentage: -1 } }
    ]);

    // Sab result save kro
    for (const student of result) {
        await AttendanceSummary.create({
            student: student.student,
            present: student.present,
            total: student.total,
            percentage: student.percentage,
            className: className
        });
    }
}

module.exports = calculateAttendanceSummaryAndSave;