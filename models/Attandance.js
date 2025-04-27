const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  class: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  students: [
    {
      student_Id:Number ,
      student_Name:String,
      student_Roll:Number,
      status: {
        type: String,
        enum: ['Present', 'Absent'],
        default: 'Absent'
      },
      
    },
  ],
});

module.exports = mongoose.model("Attendance", attendanceSchema);
