import { Router } from "express";
import { userRouter } from "./user.route.js";

export const mainRouter = Router();

mainRouter.use("/user", userRouter)