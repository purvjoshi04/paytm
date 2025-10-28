import { Router } from "express";
import { userRouter } from "./user.route.js";
import { accountRouter } from "./account.route.js";

export const mainRouter = Router();

mainRouter.use("/user", userRouter);
mainRouter.use("/account", accountRouter);