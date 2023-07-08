const { default: mongoose } = require("mongoose");
const { User, userToken } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const validEmail = (Email) => {
  if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(Email)) {
    return false;
  } else {
    return true;
  }
};

const validPwd = (Password) => {
  if (
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(
      Password
    )
  ) {
    return false;
  } else {
    return true;
  }
};

const createUser = async (req, res) => {
  try {
    const body = req.body;
    const { email, password, cnfPassword } = body;

    if (!(email && password && cnfPassword)) {
      return res
        .status(400)
        .json({ status: false, message: "All required fields" });
    }
    if (validEmail(email)) {
      return res
        .status(400)
        .json({ status: false, message: "Enter a valid email address" });
    }
    let checkEmail = await User.findOne({ email: email });
    if (checkEmail) {
      return res
        .status(400)
        .json({ status: false, message: "User already exists, login now" });
    }
    if (validPwd(password && cnfPassword)) {
      return res.status(400).json({
        status: false,
        message:
          "Password should be 8 characters long and must contain one of 0-9,A-Z,a-z and special characters",
      });
    }
    if (password !== cnfPassword) {
      return res
        .status(400)
        .json({ status: false, message: "Passwords do not match" });
    } else {
      body.password = await bcrypt.hash(body.password, 10);
      body.cnfPassword = await bcrypt.hash(body.cnfPassword, 10);
    }
    const obj = {
      email: email.toLowerCase(),
      password: body.password,
    };
    let userData = await User.create(obj);
    res.status(201).send({
      status: true,
      message: "User created successfully",
      data: userData,
    });
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const body = req.body;
    const { email, password } = body;
    if (!(email && password)) {
      return res.status(400).json({ status: false, message: "These are required fields" });
    }
    if (validEmail(email)) {
      return res.status(400).json({ status: false, message: "Enter a valid email address" });
    }
    const checkValidUser = await User.findOne({ email: body.email });
    if (!checkValidUser) {
      return res.status(404).send({ status: false, message: "Email not found " });
    }
    let checkPassword = await bcrypt.compare(
      body.password,
      checkValidUser.password
    );
 
    // console.log("checkPassword: " + checkPassword);
    if (!checkPassword) {
      return res.status(400).send({ status: false, message: "Password is not correct" });
    }

    const userPayload = {
      userId: checkValidUser._id,
      email: checkValidUser.email,
      isPayment: checkValidUser.isPayment,
      createdAt: checkValidUser.createdAt,
      updatedAt: checkValidUser.updatedAt
    };

    const accessToken = jwt.sign({ userData: userPayload }, "secretKey", {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ userData: userPayload }, "secretKey", {
      expiresIn: "7d",
    });

    const obj = {
      userId: checkValidUser._id,
      token: accessToken,
      refressToken: refreshToken,
    };
    const token = await userToken.create(obj);
    return res.status(201).json({ status: true, message: "Successfully Login", token: token });
  } catch (error) {
    console.log(error);
  }
};

const verifyToken = async (req, res) => {
  try {
    const { token } = req.body;
    const decode = jwt.verify(token, "secretKey");
    if (!decode) {
      return res.status(400).json({ status: false, message: "token is not verified" });
    }
    return res.status(200).json({ status: true, message: "token is verified", data: decode });
  } catch (error) {
    console.log(error);
  }
};

const logOut = async (req, res) => {
  try {
    const bearer = req.headers.authorization;
    let token = bearer.split(" ")[1];
    console.log(token, "token");
    const checkUser = await userToken.updateOne(
      { token: token },
      { $set: { active: 0 } },
      { new: true }
    );
    if (checkUser.nModified === 0) {
      return res.status(404).json({status: false,message: "User not found or already logged out"});
    }
    // console.log("checkUser"+checkUser);
    return res.status(200).json({status: true,message: "User logged out successfully",data: checkUser,});
  } catch (error) {
    console.log(error);
  }
};
const getAllUsers = async (req, res) => {
  try {
    const user = await User.find({});
    if (user.length === 0) {
      return res.status(400).json({ status: false, message: "Not have any users" });
    }
    return res.status(200).json({ status: true, message: "Get All Users", data: user });
  } catch (error) {
    console.log(error);
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ status: false, message: "enter a valid userid" });
    }
    const findUserId = await User.findById({ _id: userId });
    if (!findUserId) {
      return res.status(404).json({ status: false, message: "user not found" });
    }
    return res.status(200).json({ status: true, message: "Get user by id", data: findUserId });
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ status: false, message: "Enter valid user id" });
    }
    const user = await User.findByIdAndDelete({ _id: userId });
    if (!user) {
      return res.status(404).json({ status: false, message: "User already deleted or not found" });
    }
    return res.status(200).json({ status: true, message: "User deleted successfully", data: user });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  deleteUser,
  verifyToken,
  logOut,
};
