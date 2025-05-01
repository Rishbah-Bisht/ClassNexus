const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    user_id: String,
    p_path:String,
    p_like: {
        type:Number,
        default:0
    },
    description:String,
    p_comments:[
        {username:String, comments:String}
    ],
    createdAt: { type: Date, default: Date.now }  
});

const NewPost = mongoose.model("NewPost", userSchema);
module.exports = NewPost;
