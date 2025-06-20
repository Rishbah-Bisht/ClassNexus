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
  const user = await User.findOne({ Registration_Id:  req.registrationId });

  if (!user) {
    return res.status(404).send("User not found");
  }
  
  const user_info = await UserMoreInfo.findOne({ User_id: user._id });
    res.render("Student_profile.ejs", {user,user_info , timeAgo });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// 📝 Edit Profile Page
router.get("/student/profile/profileEdit", async (req, res) => {
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

      const { registrationId, className, userId } = req;
      // Get all students and class teacher IDs
      const classUsers = await User.find({ class: className }, '_id').lean();
      const classTeacher = await User.find({ ClassTeacher: className }, '_id').lean();
  
      const userIds = [
        ...classUsers.map(user => user._id.toString()),
        ...classTeacher.map(teacher => teacher._id.toString())
      ];
  
      // Fetch tweets and profile info
      const [Tweets, userInfos] = await Promise.all([
        tweet.find({ User_id: { $in: userIds } }).sort({ date: -1 }).lean(),
        UserMoreInfo.find({ User_id: { $in: userIds } }).lean()
      ]);
  
      // Map user profile info by ID
      const userInfoMap = {};
      userInfos.forEach(info => {
        userInfoMap[info.User_id.toString()] = info;
      });
  
      // Enrich tweets with user info
      const enrichedTweets = Tweets.map(tweet => {
        const info = userInfoMap[tweet.User_id.toString()] || {};
        return {
          ...tweet,
          username: info.username || "Unknown",
          profile_img: info.profile_img || "default.png"
        };
      });
    const user_role = await User.findOne({ Registration_Id: registrationId });
      res.render("Teacher_Tweet.ejs", {
        Tweets: enrichedTweets,
        registrationId,
      className,
      userId,
      user_role,
        timeAgo
      });
  
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
  try {
    const { userId, className } = req;

    if (!userId) {
      return res.status(401).send("Unauthorized: No user session found");
    }

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
  
    res.render('Student_posts.ejs', { Posts, timeAgo, user, userInfos });
  } catch (err) {
    console.error("Error in /Student/Posts:", err);
    res.status(500).send("Internal Server Error");
  }
});




router.get('/student/add-post', async (req, res) => {
  try {
    const { registrationId, className, userId } = req;

    if (!userId) {
      return res.status(401).send("Unauthorized: No user session found");
    }

    const userInfo = await UserMoreInfo.find({ User_id: userId });
    const user_role = await User.findOne({ Registration_Id: registrationId });



    res.render('Student_AddPost', {
      registrationId,
      className,
      userId,
      userInfo,
      user_role
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
