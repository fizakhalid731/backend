const mongoose = require("mongoose");

// Connect to MongoDB
function connectDB(){
     mongoose.connect("mongodb://localhost:27017/SocialApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB connection succeeded"))
    .catch((error) => console.error("Connection error:", error));

}

module.exports = connectDB;