// models/Post.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    User_id: String,
    username:String,
    Registration_Id:Number,
    className:String,
    img_path:String,
    p_like: Number,
    description:String,
    p_comments:[
        {username:String, comments:String}
    ]
});

module.exports = mongoose.model("Post", postSchema);
