// models/Post.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    _id: String,
    username:String,
    p_path:String,
    p_like: Number,
    userProfile:String,
    description:String,
    p_comments:[
        {username:String, comments:String}
    ]
});

module.exports = mongoose.model("Post", postSchema);
