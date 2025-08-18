import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.userToken;
    if (!token) {
      return res.status(401).json({
        message: `Not authorized, no token`,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_USER_KEY);
    if (!decoded) {
      return res.status(401).json({
        message: `Not authorized, token failed`,
      });
    }

    //find the user by the ID from the token payload
    // exclude the password field by name (string) and ensure user exists
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: `Not authorized, user not found` });
    }

    // attach the user object to the request
    req.user = user;
    next();
  } catch (error) {
    console.error("Authorization Error:", error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
