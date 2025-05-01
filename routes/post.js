const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const requireLogin = require('../middleware/auth');
const User = require('../models/user_login_info');
const UserMoreInfo = require("../models/user_more_info");
const ensureAuth = require("../middleware/auth");
const upload = require("../middleware/uploads");



router.use(ensureAuth, (req, res, next) => {
    req.userId = req.session.userId;
    req.registrationId = req.session.registrationId;
    req.className = req.session.className;
    next();
});

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
router.get('/add-post', async (req, res) => {
    const student_id = req.registrationId;
    const className = req.className;
    const userId = req.userId;
    const userInfo = await UserMoreInfo.find({ User_id: userId })
    res.render('Student_AddPost', { student_id, className, userId, userInfo });
});


router.post('/Add-New-post', upload.single('image'), async (req, res) => {
    const data = req.body;
  
    const newPost = new Post({
      student_id: data.student_id,
      className: data.className,
      userId: data.userId,
      username: data.username,
      description: data.description,
      img_path: req.file.path
    });
  
    try {
      await newPost.save();
      req.flash('success_msg', 'Post uploaded successfully!');
      res.redirect('/add-post');
    } catch (err) {
      console.error('Error saving post:', err);
      res.status(500).send('Error saving post');
    }
  });



module.exports = router;
