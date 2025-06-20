const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const classes = require('../models/classe');
const ensureAuth = require('../middleware/auth'); // Changed to ensureAuth
const User = require('../models/user_login_info');
const UserMoreInfo = require('../models/user_more_info'); // Fixed name for consistency
const Attandance_sumary = require("../models/Attandance_sumary");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const sendCustomEmail = require('../utils/email');

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


router.post("/Admin/Save-User-info", async (req, res) => {
  try {
    const data = req.body;

    if (data.role === 'student') {
      const newStudent = new User({
        Registration_Id: data.Student_ID,
        name: data.name,
        fatherName: data.Father_name,
        role: data.role,
        email: data.email,
        dob: data.d_o_b,
        class: data.class,
        bio: data.bio
      });
      await newStudent.save();
      await sendCustomEmail({
        to: data.email,
        name: data.name,
        id: data.Student_ID,
        role: data.role
      });
      return res.redirect('/Admin/Dashboard/studentList');
    }

    if (data.role === 'teacher') {
      const newTeacher = new User({
        name: data.name,
        Registration_Id: data.Teacher_ID,
        fatherName: data.father_name,
        email: data.email,
        dob: data.dob,
        department: data.department,
        subject: data.subject,
        role: data.role,
        qualification: data.qualification,
        experience: data.experience,
        address: data.address,
        about: data.about,
        ClassTeacher: data.class
      });
      await newTeacher.save();
      await sendCustomEmail({
        to: data.email,
        name: data.name,
        id: data.Teacher_ID,
        role: data.role
      });
      if (!req.session.userId) return res.redirect("/login");

      return res.redirect('/Admin/Dashboard/teacherlist');
    }

  } catch (error) {
    console.error(error);
    return res.status(500).send('Error saving user');
  }
});


router.get('/Admin/User/:Registration_Id', ensureAuth, async (req, res) => {
  const user = await User.findOne({ Registration_Id: req.params.Registration_Id });

  if (!user) {
    return res.status(404).send("User not found");
  }

  const user_info = await UserMoreInfo.findOne({ User_id: user._id });

  res.render('admin_User_Profile.ejs', { user, user_info });


});

// Add this route to your server
router.get('/api/get-user-role', async (req, res) => {
    try {
        const username = req.query.username;
        const user = await User.findOne({ username: username }).select('role').lean();
        
        if (user) {
            res.json({ role: user.role });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Admin Dashboard
router.get("/Admin/Dashboard", ensureAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.redirect("/login");

    const students = await User.find({ role: "student" }).sort({ createdAt: -1 });
    const teachrs = await User.find({ role: "teacher" }).sort({ createdAt: -1 });

    res.render("admin_Dashborde.ejs", { students, teachrs });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// Add Student Page
router.get("/Admin/Add-Student", ensureAuth, (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.redirect("/login");

  res.render('admin_AddStudent.ejs');
});

// Add Teacher Page
router.get("/Admin/Add-teacher", ensureAuth, (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.redirect("/login");

  res.render('admin_AddTeacher.ejs');
});

// Admin Profile Edit
router.get("/Admin/profile/profileEdit", ensureAuth, async (req, res) => {



  try {
    const userId = req.session.userId;
    const OwnerInfo = await User.findById(userId);
    const Owner_Info2 = await UserMoreInfo.findOne({ User_id: userId });
    res.render("admin_ProfileEdit.ejs", { OwnerInfo, Owner_Info2 });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// Admin Profile View
router.get("/Admin/Profile", ensureAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findOne({ Registration_Id: req.registrationId });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const user_info = await UserMoreInfo.findOne({ User_id: user._id });
    res.render("admin_Profile.ejs", { user, user_info, timeAgo });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// Admin Classes Page
router.get('/Admin/Classes', ensureAuth, (req, res) => {
  res.render('admin_subject.ejs');
});

// Admin Class View
router.get('/Admin/Class/:className', ensureAuth, (req, res) => {
  const className = req.params.className;
  res.render('admin_AllClass.ejs', { className });
});





router.get('/Admin/Class/subject/edit-subject/:subjectId', ensureAuth, async (req, res) => {
  const { subjectId } = req.params;
  const className = req.query.className;

  try {
    const classDoc = await classes.findOne({ name: className });

    if (!classDoc) return res.status(404).send('Class not found');


    res.render('admin_update_Subject', { className, classDoc, subjectId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading subject details');
  }
});


router.post('/Admin/Class/subject/edit-subject/:subjectId', ensureAuth, async (req, res) => {
  const subjectId = req.params.subjectId;
  const { className, SubjectName, SubjCode, teacher, teacher_ID } = req.body;

  try {
    // const result = await classes.updateOne(
    //   {
    //     name: className,
    //     "subjects._id": new ObjectId(subjectId),
    //   },
    //   {
    //     $set: {
    //       "subjects.$.name": SubjectName,
    //       "subjects.$.code": SubjCode,
    //       "subjects.$.teacher": teacher,
    //       "subjects.$.teacher_ID": teacher_ID,
    //     },
    //   }
    // );
    const result = await classes.findOne({
      name: className
    })
    result.subjects.forEach(e => {
      console.log(e.name)
    });



    if (result.modifiedCount === 0) {
      return res.status(404).send("Subject not found or no changes made.");
    }

    // res.redirect(`/Admin/Class/subject/${data.className}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update subject.");
  }
});


router.get('/Admin/Dashboard/studentList', ensureAuth, async (req, res) => {

  try {
    const students = await User.find({ role: "student" }).sort({ createdAt: -1 });
    res.render('admin_dashboard_studentlist.ejs', {students});
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching class data');
  }
});
router.get('/Admin/Dashboard/teacherlist', ensureAuth, async (req, res) => {
  const className = req.params.className;
  try {
    const teachrs = await User.find({ role: "teacher" }).sort({ createdAt: -1 });
    res.render('admin_dashboard_teacherlist.ejs', { teachrs});
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching class data');
  }
});


























// Get All Students in a Class
router.get('/Admin/Class/AllStudent/:className', ensureAuth, async (req, res) => {
  const className = req.params.className;
  try {
    const AllStudent = await User.find({ class: className });
     const Attandance_sumary2 = await Attandance_sumary.find({ className: className });
    res.render('admin_Student_list.ejs', { className,Attandance_sumary2, AllStudent });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching class data');
  }
});

// Get Class Teacher for a Class
router.get('/Admin/Class/ClassTeacher/:className', ensureAuth, async (req, res) => {
  const className = req.params.className;
  try {
    const teacher = await User.findOne({ ClassTeacher: className });

    if (teacher) {
      const teacherId = new ObjectId(teacher._id);
      const teachr_img = await UserMoreInfo.findOne({ User_id: teacherId });

      res.render('admin_Class_Teacher.ejs', { teacher, className, teachr_img });
    } else {
      res.render('admin_ask_Class_Teacher.ejs', { className });
    }

  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching class data');
  }
});


// Change Class Teacher Page
router.get('/Admin/Class/ClassTeacher/Change-Teacher/:className', ensureAuth, (req, res) => {
  const className = req.params.className;
  res.render('admin_ChangeClass_Teacher.ejs', { className });
});

// Change Class Teacher
router.post('/Change-teacher', ensureAuth, async (req, res) => {
  const data = req.body;
  try {
    await User.findOneAndUpdate(
      { Registration_Id: data.TeacherID },
      { $set: { ClassTeacher: data.class } },
      { runValidators: true, context: 'query' }
    );
    res.redirect(`/Admin/Class/ClassTeacher/${data.class}`);
  } catch (err) {
    console.error('Error updating teacher:', err);
    res.status(500).send('Error updating teacher data');
  }
});

// View Subjects of a Class
router.get('/Admin/Class/subject/:className', ensureAuth, async (req, res) => {
  const className = req.params.className;
  const classDoc = await classes.findOne({ name: className });
  if (!classDoc) return res.status(404).send('Class not found');
  res.render('admin_subjectInfo.ejs', { className, classDoc });
});

// Add Subject Page
router.get('/Admin/Class/subject/Add-subject/:className', ensureAuth, (req, res) => {
  const className = req.params.className;
  res.render('admin_add_Subject.ejs', { className });
});

// Add Subject POST
router.post('/add-subject', ensureAuth, async (req, res) => {
  const { className, subjectName, subjectTeacher, TeacherId, subjectCode } = req.body;
  try {
    let classDoc = await classes.findOne({ name: className });
    const subject = {
      name: subjectName,
      code: subjectCode,
      teacher: subjectTeacher,
      teacher_ID: TeacherId
    };

    if (classDoc) {
      classDoc.subjects.push(subject);
      await classDoc.save();
    } else {
      await classes.create({ name: className, subjects: [subject] });
    }

    res.redirect(`/Admin/Class/subject/${className}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding subject");
  }
});

// Delete Subject
router.post('/delete-subject/:subjectId', ensureAuth, async (req, res) => {
  const subjectId = req.params.subjectId;
  const className = req.body.className;

  try {
    const classDoc = await classes.findOne({ name: className });
    if (!classDoc) return res.status(404).send('Class not found');

    classDoc.subjects = classDoc.subjects.filter(subject => subject._id.toString() !== subjectId);
    await classDoc.save();

    res.redirect(`/Admin/Class/subject/${className}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting subject");
  }
});

module.exports = router;
