// models/Post.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    User_id: String,
    username:String,
    Registration_Id:Number,
    className:String,
    img_path:String,
    p_like: Number,
    user_role: String,
    description:String,
    p_comments:[
        {username:String, comments:String}
    ],
    date: { type: Date, default: Date.now } 
});

module.exports = mongoose.model("Post", postSchema);
