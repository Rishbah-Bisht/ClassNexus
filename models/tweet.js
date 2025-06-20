// models/Post.js
const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
    User_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username:String,
    Registration_Id:Number,
    className:String,
    user_role: String,
    description:String,
    date: { type: Date, default: Date.now }  
  });

module.exports = mongoose.model("tweet", tweetSchema);
