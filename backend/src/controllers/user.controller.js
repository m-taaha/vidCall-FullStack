import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {
  registerUserSchema,
  loginUserSchema,
} from "../validators/user.validator.js";
import { success } from "zod";

export const userRegister = async (req, res) => {
  try {
    const validation = registerUserSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: `invalid input data`,
        error: validation.error.errors,
      });
    }

    const { firstName, lastName, username, email, password } = validation.data;

    //check if userExists or not
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    //create the new user - password will be hashed form pre save hook from models

    const newUser = await User.create({
      firstName,
      lastName,
      username,
      email,
      password,
    });

    return res.status(201).json({
      message: `User registered successfully`,
      id: newUser._id,
      name: `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email,
      createdAt: newUser.createdAt,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message});
  }
};

export const userLogin = async (req, res) => {
  try {
    const validation = loginUserSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: validation.error.errors,
      });
    }

    const { email, password } = validation.data;

    //check if the user exist or not
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: `Invalid Credentials`,
      });
    }

    //password match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: `Invalid Credentials`,
      });
    }

    //generating a jwt userToken and send it back
    // note: jwt option is 'expiresIn' (case-sensitive)
    const userToken = jwt.sign({ userId: user._id }, process.env.JWT_USER_KEY, {
      expiresIn: process.env.EXPIRES_IN || "7d",
    });

    //set userToken in http only cookie
    // maxAge expects milliseconds; 7 days = 7 * 24 * 60 * 60 * 1000
    res.cookie("userToken", userToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });

    return res.status(200).json({
      message: `Login Successfull`,
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: `Server Error` });
  }
};


export const userLogout = async (req, res) => {
  res.cookie("userToken", "", {maxAge: 0}); //deletes the cookie immediately 
  return res.status(200).json({
    success: true,
    message: "Logged out successfully"
  })
}

export const userGetMe =  async (req, res) => {
  try{
    const user = await User.findById(req.user._id).select("-password")
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        firstName: user.firstName
      }
    })
  } catch(error) {
    console.log("Error in userGetMe", error);
    return res.status(500).json({
      message: "Server Error"
    })
  }
}