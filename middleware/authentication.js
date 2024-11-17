const jwt = require("jsonwebtoken");
const secretKey = "mykey";

exports.authenticate = async (req,res,next) => {
    let token = req.headers['token'];
    if(!token){
      return res.status(401).json({
        message:"Not logged In."
      })
    }
    jwt.verify(token, secretKey, function(err, decoded){
        if(err){
            return res.status(403).json({
                message: "Invalid token!"
            });
        }
        req.user = decoded;
        next();
    });
  
  }
