import {Router, type Request, type Response} from "express";
export const userRouter = Router();

userRouter.post("/signup", (req: Request, res: Response) => {
    const {userName, password, firstName, lastName} = req.body;

    if (!userName || !password || !firstName || !lastName) {
        res.
    }
})