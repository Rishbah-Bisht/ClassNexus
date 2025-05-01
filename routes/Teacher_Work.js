const express = require('express');
const path = require('path');
const app = express();
const router = express.Router();
const fs = require("fs");
const Class = require('../models/classe');
const User = require('../models/user_login_info');
const UserMoreInfo = require("../models/user_more_info");
const AllPosts = require("../models/post");
const tweet = require("../models/tweet");
const Assigment_Schema = require("../models/Assigment_Schema");
const upload = require("../middleware/uploads");
const { route } = require('./auth');
const ensureAuth = require("../middleware/auth");
const Attendance = require("../models/Attandance");
const Attandance_sumary = require("../models/Attandance_sumary");
const checkClassTime = require('../middleware/checkClassTime');
const Assignment = require('../middleware/assigment');
const calculateAttendanceSummaryAndSave = require('../middleware/calculateAttendanceSummary');
const Assigment_Data = require('../models/Assigment_Schema.js');

const timeAgo = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return `${seconds} sec ago`;
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hrs ago`;
    return `${days} days ago`;
};


async function loadTeacherData(req, res, next) {
    try {
        const teacher_db_ID = req.session.userId;
        if (!teacher_db_ID) return res.redirect('/login');
        const Teacher_ = await User.findById(teacher_db_ID);
        const Teacher_Data = await UserMoreInfo.findOne({ User_id: teacher_db_ID });
        req.teacherBasic = Teacher_;
        req.teacherMore = Teacher_Data;
        next();
    } catch (err) {
        console.error('Error loading teacher data:', err);
        res.redirect('/login');
    }
}




router.get('/Teacher/Profile', ensureAuth, loadTeacherData, async (req, res) => {
    try {
        const userId = req.userId;
      const user = await User.findOne({ Registration_Id:  req.registrationId});
    
      if (!user) {
        return res.status(404).send("User not found");
      }
      
      const user_info = await UserMoreInfo.findOne({ User_id: user._id });
    
        res.render("Teacher_profile.ejs", {user,user_info , timeAgo });
      } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
      }
});

router.get("/teacher/profile/profileEdit", async (req, res) => {
  try {
    const userId = req.userId;
    const OwnerInfo = await User.findById(userId);
    const Owner_2 = await UserMoreInfo.findOne({ User_id: userId });

    res.render("Student_profileEdit.ejs", { OwnerInfo, Owner_2 });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

router.get('/Teacher/My-Class', ensureAuth, checkClassTime, loadTeacherData, async (req, res) => {
    
    res.render('Teacher_MyClass.ejs', {
        classInfo: req.teacherBasic.ClassTeacher
    });
});

router.get('/Teacher/Posts', async (req, res) => {
  const userId = req.userId;
  const className = req.className;
  const classUsers = await User.find({ class: className }, '_id').lean();
    const classTeacher = await User.find({ ClassTeacher: className }, '_id').lean();

    const userIds = [
      ...classUsers.map(user => user._id.toString()),
      ...classTeacher.map(teacher => teacher._id.toString())
    ];

    const [Posts, userInfos, user] = await Promise.all([
      AllPosts.find({ User_id: { $in: userIds } }).sort({ date: -1 }).lean(),
      UserMoreInfo.find({ User_id: { $in: userIds } }).lean(),
      User.findById(userId).lean()
    ]);
    res.render('Teacher_Posts.ejs', { Posts, timeAgo,user,userInfos })
});

router.get('/teacher/add-post', async (req, res) => {
  try {
    const { registrationId, className, userId } = req;

    // Check if userId exists
    if (!userId) {
      return res.status(401).send("Unauthorized: No user session found");
    }

    // Fetch user info from the UserMoreInfo collection
    const userInfo = await UserMoreInfo.find({ User_id: userId });

    // Render the 'Teacher_AddPost' page with the data
    res.render('Teacher_AddPost', {
      registrationId,
      className,
      userId,
      userInfo
    });
  } catch (err) {
    // Log and return a server error if any exception occurs
    console.error("Error in /teacher/add-post:", err);
    res.status(500).send("Internal Server Error");
  }
});



router.get('/Teacher/My-Class/AllStudent/:classInfo', ensureAuth, loadTeacherData, async (req, res) => {
    const className = req.teacherBasic.ClassTeacher;
    const AllStudent = await User.find({ class: req.teacherBasic.ClassTeacher }).sort({ name: 1 });
    const Attandance_sumary2 = await Attandance_sumary.find({ className: className });
    res.render('Teacher_AllStudents.ejs', { AllStudent, Attandance_sumary2, className: req.teacherBasic.ClassTeacher })
});

router.get('/Teacher/My-Class/Attandace', checkClassTime, ensureAuth, loadTeacherData, async (req, res) => {
    res.render('Teacher_Show_Attendance_option.ejs', { className: req.teacherBasic.ClassTeacher });
});

router.get('/Teacher/My-Class/Attandace/Show-AllStudent', checkClassTime, ensureAuth, loadTeacherData, async (req, res) => {
    const className = req.teacherBasic.ClassTeacher;
    const AllStudent = await User.find({ class: className }).sort({ name: 1 });
    const studentsAttandance = await Attendance.find({ class: className });

    const Attandance_sumary2 = await Attandance_sumary.find({ className: className });
    res.render('Teacher_Show_Student_Attandace.ejs', { AllStudent, Attandance_sumary2, studentsAttandance, className });
});



router.get('/Teacher/My-Class/Attandace/Marked-Attandance', checkClassTime, ensureAuth, loadTeacherData, async (req, res) => {
    const className = req.teacherBasic.ClassTeacher;
    const AllStudent = await User.find({ class: className }).sort({ name: 1 });
    const alreadyMarked = false;
    res.render('Teacher_Attandance.ejs', { AllStudent, className: req.teacherBasic.ClassTeacher, alreadyMarked });
});




router.post("/mark-attendance", checkClassTime, async (req, res) => {
    const { StudentRegistration_Id, rollno, StudentName, className, attendance } = req.body;
    const teacherId = req.session.userId;
    const studentsAttendance = Object.keys(attendance).map(studentId => ({
        student_Id: StudentRegistration_Id[studentId],
        student_Roll: rollno[studentId],
        student_Name: StudentName[studentId],
        student: studentId,
        status: attendance[studentId]
    }));
    // Create attendance record
    const newAttendance = new Attendance({
        date: new Date(),
        class: className,
        teacher: teacherId,
        students: studentsAttendance,
    });

    try {
        await newAttendance.save();
        await calculateAttendanceSummaryAndSave(className);
        req.flash('success_msg', 'Attendace Marked successfully!');
        res.redirect(`/Teacher/My-Class/Attandace/Show-AllStudent`);

    } catch (err) {
        console.error("Error saving attendance", err);
        res.status(500).send("Error marking attendance");
    }
});

router.get('/Teacher/My-Class/Assingment', checkClassTime, ensureAuth, loadTeacherData, async (req, res) => {
    const className = req.teacherBasic.ClassTeacher;
    res.render('Teacher_Show_Assignment_Options.ejs', { className });
});

router.get('/Teacher/My-Class/Assingment/Upload-Assigment', checkClassTime, ensureAuth, loadTeacherData, async (req, res) => {
    const className = req.teacherBasic.ClassTeacher;
    const Subject = await Class.find({ name: className });
    res.render('Teacher_Upload_Assingment.ejs', { Subject, className });
});


router.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads/Assigments', filename);

    res.download(filePath, filename, (err) => {
        if (err) {
            console.error('Download error:', err);
            res.status(404).send("File not found or error downloading");
        }
    });
});

router.get('/Teacher/My-Class/Assingment/See-Assigment', checkClassTime, ensureAuth, loadTeacherData, async (req, res) => {
    const className = req.teacherBasic.ClassTeacher;
    const Assigments = await Assigment_Data.find({ className: className });
    console.log(Assigments)
    res.render('Teacher_Show_Assigments.ejs', { Assigments, className });
});


router.post('/Upload/Assignment', Assignment.single('assignmentFile'), async (req, res) => {
    try {
        const { className, subject, title, description, dueDate } = req.body;
        const fileUrl = req.file.path; // multer se milta hai file info
        const newAssignment = await Assigment_Schema.create({
            className,
            subject,
            title,
            description,
            dueDate,
            fileUrl
        });
        req.flash('success_msg', 'Assingment Upload successfully!');
        res.redirect('/Teacher/My-Class/Assingment/See-Assigment')

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error uploading assignment" });
    }
})
module.exports = router;
