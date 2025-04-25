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





// ✅ Import Auth Middleware
const ensureAuth = require("../middleware/auth");



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




// 📄 All Posts of Student
router.get("/Student/posts", ensureAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);
    const AllPosts = await AddPost.find({ user_id: userId }).sort({ createdAt: -1 });

    res.render("Student_posts.ejs", {
      users: [user],
      AllPosts,
      timeAgo
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});





// 📝 Save New Post
router.post('/save-Post', ensureAuth, upload.single('image'), async (req, res) => {
  const { description } = req.body;
  const userId = req.session.userId;

  try {
    const imagePath = req.file ? req.file.path.replace("public/", "") : null;

    const NewPost = new AddPost({
      user_id: userId,
      p_path: imagePath,
      description: description
    });

    await NewPost.save();
    res.redirect('/Student/posts');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving post");
  }
});





// ➕ Add Post Page
router.get("/Student/add-post", ensureAuth, (req, res) => {
  res.render("Student_AddPost.ejs");
});




// 👤 Student Profile
router.get("/Student/profile", ensureAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const OwnerInfo = await User.findById(userId);
    const Owner_Info2 = await UserMoreInfo.findOne({ User_id: userId });

    res.render("Student_profile.ejs", { OwnerInfo, Owner_Info2, timeAgo });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});



// 📝 Edit Profile Page
router.get("/profile/profileEdit", ensureAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const OwnerInfo = await User.findById(userId);
    const Owner_2 = await UserMoreInfo.findOne({ User_id: userId });

    res.render("Student_profileEdit.ejs", { OwnerInfo, Owner_2 });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});



// 🐦 Tweets Page
router.get("/Student/tweets", ensureAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const OwnerInfo = await User.findById(userId);
    const Alltweets = await tweet.find({ User_id: userId }).sort({ createdAt: -1 });

    res.render("Student_tweet.ejs", { Alltweets, OwnerInfo, timeAgo });

  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});




// 📚 Subjects Page
router.get('/Student/subjects', ensureAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
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

module.exports = router;
