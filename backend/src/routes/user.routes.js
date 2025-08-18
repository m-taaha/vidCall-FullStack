import { Router } from "express";

import { userRegister, userLogin } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
// userRouter.post("/logout", userLogout);
// userRouter.post("/add_to_activity", userLogout);
// userRouter.post("/get_all_activity", userLogout);

export default userRouter;
