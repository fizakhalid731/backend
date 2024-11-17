const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
   
    },
    username:{
        type: String,
        required: false
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the current date and time when the post is created
    },

   
});

module.exports = mongoose.model("userpost",postSchema);