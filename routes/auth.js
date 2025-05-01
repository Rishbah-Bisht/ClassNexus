const express = require("express");
const session = require("express-session");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user_login_info");
const user_more_info = require("../models/user_more_info");

// ✅ Import Middleware
const ensureAuth = require("../middleware/auth");

// ✅ Render: Check Valid User
router.get("/ck", (req, res) => {
  res.render("check_valid_User.ejs");
});

// ✅ Render: Sign-Up Form (Only if not already signed up)
router.get("/sign-up", async (req, res) => {
  const users = await User.find();
  res.render("signUp.ejs", { users });
});

// ✅ Signup Handler
router.post("/signup", async (req, res) => {
  const { User_id, password } = req.body;

  try {
    const existingUser = await User.findOne({ Registration_Id: User_id });

    if (!existingUser) {
      return res.status(404).send("❌ User not found with that Registration ID.");
    }

    if (existingUser.singUp == 'yes') {
      return res.status(400).send("⚠️ User already signed up.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(
      existingUser._id,
      {
        $set: {
          password: hashedPassword,
          singUp: "yes"
        }
      },
      { new: true }
    );

    req.session.userId = updatedUser._id;
    req.session.save(err => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).send("Session error");
      }
      res.render("Succesful_.ejs");
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).send("Signup failed");
  }
});

// ✅ Check if User Exists Before Sign-up
router.post("/Check_user", async (req, res) => {
  const { user_id } = req.body;

  try {
    const existingUser = await User.findOne({ Registration_Id: user_id });

    if (!existingUser) {
      return res.send("❌ Sorry, user not registered in our system.");
    }

    req.session.userId = existingUser._id;
    req.session.save(err => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).send("Session error");
      }

      if (existingUser.singUp === "no") {
        return res.render("signUp.ejs", { user_id });
      } else {
        return res.redirect("/login");
      }
    });

  } catch (err) {
    console.error("Error checking user:", err);
    return res.status(500).send("Internal Server Error");
  }
});

// ✅ Render: User Info (Protected)
router.get("/userInfo", ensureAuth, (req, res) => {
  res.render("userInfo.ejs");
});

// ✅ Render: Login Page
router.get("/login", (req, res) => {
  res.render("Login.ejs");
});

// ✅ Handle Login
router.post("/login", async (req, res) => {
  const { Registration_Id, password } = req.body;

  try {
    const user = await User.findOne({ Registration_Id });
    if (!user) return res.send("❌ User not found");
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send("❌ Incorrect password");
    const user_2 = await user_more_info.findOne({ User_id: user._id });


    if (user_2 &&
      user_2.profile_img && user_2.profile_img.trim() !== '' &&
      user_2.username && user_2.username.trim() !== '' &&
      user_2.bio && user_2.bio.trim() !== '') {

      req.session.userId = user._id;
      req.session.registrationId = user.Registration_Id;
      req.session.className = user.class;

      req.session.save(err => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).send("Session error");
        }

        if (user.role === "Admin") {
          return res.redirect("/Admin/Dashboard");
        } else if (user.role === "student") {
          return res.redirect("/Student/profile");
        } else if (user.role === "teacher") {
          return res.redirect("/Teacher/profile");
        } else {
          return res.send("❓ Unknown role");
        }
      });
    } else {
      req.session.userId = user._id;
      req.session.registrationId = user.Registration_Id;

      req.session.className = user.class;


      res.render('userInfo.ejs');
    }




  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get('/check-username-db', async (req, res) => {
  const { username } = req.query;

  if (!username) return res.json({ exists: false });

  try {
    const user = await user_more_info.findOne({ username: username });
    res.json({ exists: !!user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ exists: false });
  }
});



// ✅ Logout (Protected)
router.get("/logout", ensureAuth, (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
