const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const requireLogin = require('../middleware/auth');
const User = require('../models/user_login_info');

router.get('/dashboard', requireLogin, async (req, res) => {
    const user = await User.findById(req.session.userId);
    res.render('dashboard', { user });
});

router.get('/myposts', requireLogin, async (req, res) => {
    const posts = await Post.find({ user: req.session.userId });
    res.render('myposts', { posts });
});

router.post('/create-post', requireLogin, async (req, res) => {
    await Post.create({
        user: req.session.userId,
        content: req.body.content
    });
    res.redirect('/myposts');
});



module.exports = router;
