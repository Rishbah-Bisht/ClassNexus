const express = require('express');
const path = require("path");
const router = express.Router();
const fs = require("fs");
const upload = require("../middleware/uploads"); // Your multer config
const User = require("../models/user_login_info");
const Tweet = require("../models/tweet");
const UserMoreInfo = require("../models/user_more_info");

// ✅ Save user data (profile, bio)
router.post('/Save-User-Data', upload.single('profileImage'), async (req, res) => {
    const { bio, username } = req.body;
    const userId = req.session.userId;

    if (!userId) return res.redirect("/login");

    try {
        const user = await User.findById(userId);
        if (!user) {
            req.session.destroy();
            return res.redirect("/login");
        }

        let user_info = await UserMoreInfo.findOne({ User_id: userId });
        let newImagePath = req.file ? req.file.path.replace("public/", "") : null;

        if (user_info && user_info.profile_img && req.file) {
            const oldImagePath = path.join(__dirname, "../public", user_info.profile_img);
            if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }

        if (user_info) {
            user_info.username = username;
            user_info.bio = bio;
            if (newImagePath) user_info.profile_img = newImagePath;
            await user_info.save();
        } else {
            user_info = new UserMoreInfo({
                User_id: userId,
                username,
                bio,
                profile_img: newImagePath || "images/default-profile.jpg"
            });
            await user_info.save();
        }
        const roleRoutes = {
            Admin: "/Admin/Dashboard",
            student: "/Student/profile",
            teacher: "/Teacher/profile"
          };
          
          return res.redirect(roleRoutes[user.role] || "/UnknownRole");
    } catch (err) {
        console.error("Error saving user data:", err);
        res.status(500).send("Error saving user data");
    }
});

// ✅ Save tweet
router.post("/save-tweet", async (req, res) => {
    const { tweets } = req.body;
    const userId = req.session.userId;

    try {
        const newTweet = new Tweet({
            User_id: userId,
            p_like: 0,
            newtweet: tweets,
            p_comments: []
        });
        await newTweet.save();
        res.redirect("tweets");
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});

// ✅ Update user profile info
router.post("/Update-user-info", upload.single("p_img"), async (req, res) => {
    const { web_name, bio } = req.body;
    const userId = req.session.userId;

    if (!userId) return res.status(401).send("User not logged in");

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).send("User not found");

        const existingInfo = await UserMoreInfo.findOne({ User_id: userId });

        let imagePath = existingInfo?.profile_img || "";
        if (req.file?.path) {
            // Normalize path for use in URLs
            imagePath = req.file.path.replace(/^public[\\/]/, "").replace(/\\/g, "/");
        }

        const updateFields = {
            profile_img: imagePath,
            bio,
            w_name: web_name,
            user_Rg_id: user.Registration_Id,
        };

        await UserMoreInfo.findOneAndUpdate(
            { User_id: userId },
            { $set: updateFields },
            { new: true, upsert: true }
        );

        const role = user.role?.toLowerCase();
        if (role === "admin") {
            res.redirect("/Admin/Profile");
        } else if (role === "teacher") {
            res.redirect("/Teacher/Profile");
        } else if (role === "student") {
            res.redirect("/Student/profile");
        } else {
            res.send("❓ Unknown role");
        }

    } catch (err) {
        console.error("Error updating user info:", err);
        if (!res.headersSent) res.status(500).send("Something went wrong");
    }
});


module.exports = router;
