const express = require('express');
const path = require('path');
const router = express.Router();
const fs = require("fs");

const Class = require('../models/classe');
const User = require('../models/user_login_info');
const UserMoreInfo = require("../models/user_more_info");
const AllPosts = require("../models/post");
const tweet = require("../models/tweet");
const upload = require("../middleware/uploads");
const Assigment_Data = require('../models/Assigment_Schema.js');
const calculateAttendanceSummaryAndSave = require('../middleware/calculateAttendanceSummary');
const Attandance_sumary = require("../models/Attandance_sumary");
const Attendance = require("../models/Attandance");

// ✅ Import Auth Middleware
const ensureAuth = require("../middleware/auth");

// ✅ Middleware to apply auth and extract userId globally
router.use(ensureAuth, (req, res, next) => {
  req.userId = req.session.userId;
  req.registrationId = req.session.registrationId;
  req.className = req.session.className;
  next();
});

// ⏱️ Time Ago Utility
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





// 👤 Student Profile
router.get("/Student/profile", async (req, res) => {
  try {
    const userId = req.userId;
    const OwnerInfo = await User.findById(userId);
    const Owner_Info2 = await UserMoreInfo.findOne({ User_id: userId });

    res.render("Student_profile.ejs", { OwnerInfo, Owner_Info2, timeAgo });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// 📝 Edit Profile Page
router.get("/profile/profileEdit", async (req, res) => {
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

// 🐦 Tweets Page
router.get("/Student/tweets", async (req, res) => {
  try {
    const userId = req.userId;
    const OwnerInfo = await User.findById(userId);
    const Alltweets = await tweet.find({ User_id: userId }).sort({ createdAt: -1 });

    res.render("Student_tweet.ejs", { Alltweets, OwnerInfo, timeAgo });

  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// 📚 Subjects Page
router.get('/Student/subjects', async (req, res) => {
  try {
    const userId = req.userId;
    const student = await User.findById(userId);
    const classDoc = await Class.findOne({ name: student.class });

    res.render('Student_Subject.ejs', {
      className: student.class,
      classDoc
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching class data');
  }
});


router.get('/Student/Posts', async (req, res) => {
  const userId = req.userId;
  const className = req.className;
  const classUsers = await User.find({ class: className }, '_id');
  const userIds = classUsers.map(user => user._id.toString());
  const user = await User.find({ _id: userId });
  // Step 2: Fetch posts of those users
  const Posts = await AllPosts.find({ User_id: { $in: userIds } }).sort({ date: -1 });

  // Step 3: Fetch User Info for profile pictures
  const userInfos = await UserMoreInfo.find({ User_id: { $in: userIds } });

  res.render('Student_posts.ejs', { Posts, timeAgo, user, userInfos })
});



router.get('/student/add-post', async (req, res) => {
  try {
    const { registrationId, className, userId } = req;

    if (!userId) {
      return res.status(401).send("Unauthorized: No user session found");
    }

    const userInfo = await UserMoreInfo.find({ User_id: userId });

    res.render('Student_AddPost', {
      registrationId,
      className,
      userId,
      userInfo
    });
  } catch (err) {
    console.error("Error in /student/add-post:", err);
    res.status(500).send("Internal Server Error");
  }
});

// 📚 Attendance Page
router.get('/Student/Attandance', async (req, res) => {
  try {
    const student_id = req.registrationId;
    const className = req.className;
    const summary = await Attandance_sumary.find({ student_id: student_id });

    const result = await Attendance.aggregate([
      {
        $match: {
          "students.student_Id": student_id
        }
      },
      {
        $project: {
          date: 1,
          class: 1,
          student: {
            $filter: {
              input: "$students",
              as: "stu",
              cond: { $eq: ["$$stu.student_Id", student_id] }
            }
          }
        }
      }
    ]);


    res.render("Student_Attandance.ejs", {
      summary,
      className,
      result
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading attendance");
  }
});


router.get('/Student/Assigment', async (req, res) => {
  const className = req.className;
  const Assigments = await Assigment_Data.find({ className: className });
  res.render('Student_Assigment.ejs', { Assigments, className });
});


module.exports = router;
