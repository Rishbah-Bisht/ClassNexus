const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const requireLogin = require('../middleware/auth');
const User = require('../models/user_login_info');
const UserMoreInfo = require("../models/user_more_info");
const ensureAuth = require("../middleware/auth");
const upload = require("../middleware/uploads");
const AllPosts = require("../models/post");


router.use(ensureAuth, (req, res, next) => {
    req.userId = req.session.userId;
    req.registrationId = req.session.registrationId;
    req.className = req.session.className;
    next();
});


router.get("/Posts", async (req, res) => {
    try {
      const userId = req.userId;
      const user = await User.findById(userId); // fixed here
  
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      if (user.role === "Admin") {
        return res.redirect("/Admin/Dashboard");
      } else if (user.role === "student") {
        return res.redirect("/Student/Posts");
      } else if (user.role === "teacher") {
        return res.redirect("/Teacher/Posts");
      } else {
        return res.send("❓ Unknown role");
      }
    } catch (err) {
      console.error("Error in /Posts:", err);
      res.status(500).send("Error loading posts");
    }
  });
  
  
  
  


router.post('/Add-New-post', upload.single('image'), async (req, res) => {
    const data = req.body;
    try {
        const newPost = new Post({
            Registration_Id: data.registrationId,
            className: data.className,
            User_id: data.userId,
            username: data.username,
            description: data.description,
            img_path: req.file.path
        });


        await newPost.save();
        req.flash('success_msg', 'Post uploaded successfully!');
        res.redirect('/Posts');
    } catch (err) {
        console.error('Error saving post:', err);
        res.status(500).send('Error saving post');
    }
});



module.exports = router;
