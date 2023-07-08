const jwt = require("jsonwebtoken");
const User = require("../models/user");
const mongoose=require("mongoose")

const authentication = (req, res, next) => {
  try {
    let bearerHeader = req.headers.authorization;
    if (typeof bearerHeader == "undefined")
      return res.status(400).send({ status: false, message: "Token is missing" });

    let bearerToken = bearerHeader.split(" ");
    let token = bearerToken[1];
    console.log(token)
    req.decodedToken = jwt.verify(token, "secretKey", {ignoreExpiration: true});
    console.log("token",req.decodedToken)
    // if (!req.decodedToken)
    //   return res.status(400).send({ status: false, msg: "Invalid token" });

    const tokenExpire = req.decodedToken.exp;
    if (tokenExpire * 1000 < Date.now())
        return res.status(400).send({ status: false, msg: "token Expires" });
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(403).send({ status: false, msg: "token already expire" });
    }
    if (err.message.includes("invalid token")) {
      return res.status(400).send({ msg: "bad request..the token you are trying is invalid" });
    }
    console.log(err)
  }
};

const authorization = async (req, res, next) => {
  try {
    let loggedInUser = req.decodedToken.userId;
    let loginUser=req.params.userId;

    if (req.params.userId) {
      if (!mongoose.isValidObjectId(req.params.userId))
        return res.status(400).send({ status: false, message: "Enter a valid user Id" });
        
      if (loggedInUser !== loginUser)
      return res.status(403).send({ status: false, message: "Error!! authorization failed" });

      let checkUserId = await User.findById(req.params.userId);

      if (!checkUserId)
        return res.status(404).send({ status: false, message: "User not found" });
      loginUser = checkUserId._id.toString();
    }

    if (!loginUser)
      return res.status(400).send({ status: false, message: "User-id is required" });

    next();
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

module.exports = { authentication, authorization };