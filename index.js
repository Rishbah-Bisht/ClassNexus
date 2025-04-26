const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
// Route Files
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const Admin_Work = require('./routes/Admin_Work');
const Student_Work = require('./routes/Student_Work');
const Teacher_Work = require('./routes/Teacher_Work');
const update_routes = require('./routes/update_routes');
const Student_Chat_Bot = require('./routes/Student_Chat_Bot');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/classnexus')
    .then(() => console.log("✅ MongoDB connected successfully!"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware Setup
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // Express's built-in middleware to handle JSON

// Session Setup
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/classnexus',
        collectionName: 'sessions',
        ttl: 14 * 24 * 60 * 60 // 14 days
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        secure: false,  // Set to true if using HTTPS
    }
}));

// Static Files
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/js")));
app.use('/uploads', express.static('uploads'));  // Serve uploaded files

// View Engine & Multiple Views Directory Setup
app.set("view engine", "ejs");
app.set("views", [
    path.join(__dirname, "views/Admin"),
    path.join(__dirname, "views/Student"),
    path.join(__dirname, "views/authantication"),
    path.join(__dirname, "views/Teacher")
]);

app.use(flash());

// 3. flash ko res.locals me daalna (for ejs use)
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// Routes
app.use('/', authRoutes);
app.use('/', postRoutes);
app.use('/', Admin_Work);
app.use('/', Student_Work);
app.use('/', Teacher_Work);
app.use('/', update_routes);
app.use('/api', Student_Chat_Bot);

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
