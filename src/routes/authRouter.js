import { Router } from "express";
import { signIn, signUp } from "../controllers/authController.js";

import validateNewUserMiddleware from "../middlewares/validateNewUserMiddleware.js";

const authRouter = Router();

authRouter.post("/sign-up", validateNewUserMiddleware, signUp);

authRouter.post("/sign-in", signIn);

export default authRouter;
