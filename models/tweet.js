// models/Post.js
const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
    newtweet: String,
    p_like: { type: Number, default: 0 },
    p_comments: { type: Array, default: [] },
    User_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }  
  });

module.exports = mongoose.model("tweet", tweetSchema);
