import { Router } from "express";

import { userRegister, userLogin, userLogout, userGetMe } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.post("/logout", userLogout);
// userRouter.post("/add_to_activity", userLogout);
// userRouter.post("/get_all_activity", userLogout);

userRouter.get("/me", protectRoute ,userGetMe)

export default userRouter;
