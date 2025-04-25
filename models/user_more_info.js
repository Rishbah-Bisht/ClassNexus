const mongoose = require('mongoose');

const userMoreInfo = new mongoose.Schema({
    User_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: {
        type: mongoose.Schema.Types.ObjectId,
        type: String,
        unique: true,
        required: true,
        sparse: true
    },
    user_Rg_id:Number,
    bio: String,
    profile_img: String,
    follower: {
        type: Number,
        default: 0
    },
    following: {
        type: Number,
        default: 0
    },
    w_name:String
});

module.exports = mongoose.model('user_More_Info', userMoreInfo);
