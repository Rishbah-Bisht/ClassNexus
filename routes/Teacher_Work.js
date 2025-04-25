const express = require('express');
const path = require('path');
const router = express.Router();
const fs = require("fs");
const Class = require('../models/classe');
const User = require('../models/user_login_info');
const UserMoreInfo = require("../models/user_more_info");
const AddPost = require("../models/addPost");
const tweet = require("../models/tweet");
const upload = require("../middleware/uploads");
const { route } = require('./auth');
const ensureAuth = require("../middleware/auth");
const Attendance = require("../models/Attandance"); 
const checkClassTime = require('../middleware/checkClassTime');


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
    res.render('Teacher_profile.ejs', {
        OwnerInfo: req.teacherBasic,
        Owner_Info2: req.teacherMore
    });
});

router.get('/Teacher/My-Class', ensureAuth, loadTeacherData, async (req, res) => {
    res.render('Teacher_MyClass.ejs', {
        classInfo: req.teacherBasic.ClassTeacher
    });
});

router.get('/Teacher/My-Class/AllStudent/:classInfo', ensureAuth, loadTeacherData, async (req, res) => {
    const AllStudent = await User.find({class:req.teacherBasic.ClassTeacher}).sort({ name: 1 });
    res.render('Teacher_AllStudents.ejs',{AllStudent ,className: req.teacherBasic.ClassTeacher})
});

router.get('/Teacher/My-Class/Attandace',checkClassTime, ensureAuth, loadTeacherData, async (req, res) => {
    const AllStudent = await User.find({class:req.teacherBasic.ClassTeacher}).sort({ name: 1 });
    const alreadyMarked = false;
    res.render('Teacher_Attandance.ejs',{AllStudent,className: req.teacherBasic.ClassTeacher, alreadyMarked });
});


router.post("/mark-attendance",checkClassTime, async (req, res) => {
    const { className,attendance } = req.body;
    const teacherId = req.session.userId;
    const studentsAttendance = Object.keys(attendance).map(studentId => ({
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
        res.send("Attendance marked successfully!");
    } catch (err) {
        console.error("Error saving attendance", err);
        res.status(500).send("Error marking attendance");
    }
});



module.exports = router;
