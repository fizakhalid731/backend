const User = require('../model/usermodel');
const userposts = require('../model/userposts');
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const secretKey = "mykey";





exports.getuser = async (req, res) => {
    const users = await User.find({});
    res.json(users);
}

exports.sign_up = async (req, res) => {
   
    const { username, email, password } = req.body;
    console.log(req.body);

    if (!username.trim() || !email.trim() || !password.trim()) {
        return res.status(400).json({ message: 'Fields cannot contain only spaces' });
      }
    
    const useralreadyexist= await User.findOne({username});
    if(useralreadyexist){
        return res.status(400).json({message: "Username already Exist"})
    }
 
    const newUser = new User({
        username,
        email,
        password
    });

    await newUser.save();

    console.log("Record inserted Successfully");
    return res.status(200).json({message: "signup successfull"});

    
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
         console.log(req.body)

         if (!email.trim() || !password.trim()) {
            return res.status(400).json({ message: 'Fields cannot contain only spaces' });
          }

        // Check if the user exists
        const loginUser = await User.findOne({ email });
        if (!loginUser) {
            return res.status(401).json({ message: "User not found" });
        }
      if(loginUser.password !== password){
        return res.status(401).json({ message: "Invalid password" });
      }
       
        // Generate a token
        const token = jwt.sign({Email: loginUser.email, username: loginUser.username }, secretKey, { expiresIn: "1h" });

        // Store the token in local storage on the client-side (handled by frontend)
        return res.status(200).json({
            message: `User login successfully. Welcome, ${email}`,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Login error" });
    }
}

exports.addpost = async (req, res) =>{
   try {
    const {title, description} = req.body;
    const loggeduser = req.user.username;

    if (!title.trim() || !description.trim) {
        return res.status(400).json({ message: 'Title and description are required & cannot contain only spaces' });
    }


    const newpost = new userposts({
        title: title,
        description: description,
        username: loggeduser,
        userId: req.user._id
    });
    const savePost = await newpost.save();


    return res.status(201).json({message: 'post created', savePost});
   } catch (error) {
    return res.status(500).json({ message: 'Error creating post', error });
   }
}

exports.fetchallPost = async (req, res) =>{
    try {
        const  loggeduser = req.user.username;
        const posts = await userposts.find({username: {$ne: loggeduser}});
       
        if(!posts || posts.length === 0){
            return res.status(404).json({message: 'no posts found'})
        }
       
        return res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
}

exports.fetchpost = async (req, res) =>{
    try {
        const posts = await userposts.find({username: req.user.username});
        return res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
}

exports.updatepost = async (req, res) =>{
    try {
        const postId = req.params.id;
        const {title, description} = req.body;
        const editpost = await userposts.findByIdAndUpdate(postId,
            {title, description},
            {new: true} );

        if(!editpost){
            return res.status(404).json({message: 'post not found'});
        }
        return res.status(200).json({message: 'post updated', editpost});
    } catch (error) {
        res.status(500).json({ message: 'Error updating post', error }); 
    }
}

exports.deletepost = async (req, res) =>{
    try {
        const postId = req.params.id;
        const deletePost = await userposts.findByIdAndDelete(postId);
        if(!deletePost){
            return res.status(404).json({message: 'post not found'});
        }
        return res.status(200).json({message: 'post deleted'});
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error });
    }
}

exports.getuserInfo = async(req, res) =>{
    const loggedUser = req.user.username;
    const userinfo = await User.findOne({username: loggedUser});
    if(userinfo){
        return res.status(200).json({user:{ username: userinfo.username, email: userinfo.email}});
    }
    return res.status(404).json({message: "user not found"})
}

exports.updateUserInfo = async (req, res) =>{
    try{
    const loggedUser = req.user.username;
    const { email, password } = req.body;

    if ( !email || !password) {
        return res.status(400).json({ message: 'Please provide all fields: email, and password.' });
      }

    const updateUser = await User.findOneAndUpdate(
        {username: loggedUser},
        { email, password},
        {new: true}
    )
    if(!updateUser){
        return res.status(404).json({message: 'user not found'})  
    }

    return res.status(200).json({
        username: updateUser.username,
        email: updateUser.email
    })
}catch(error){
    return res.status(500).json({ message: 'Error updating user data', error });
}
}