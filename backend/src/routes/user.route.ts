import { Router, type Request, type Response } from "express";
import z from "zod";
import { UserModel } from "../db/db.js";
import bcrypt from "bcrypt";

export const userRouter = Router();

userRouter.post("/signup", async (req: Request, res: Response) => {
    const requiredBody = z.object({
        userName: z.string(),
        lastName: z.string(),
        firstName: z.string(),
        password: z.string()
            .min(8, { message: "Password must be at least 8 characters" })
            .refine((password) => /[A-Z]/.test(password), {
                message: "Password must contain at least one uppercase letter"
            })
            .refine((password) => /[a-z]/.test(password), {
                message: "Password must contain at least one lowercase letter",
            })
            .refine((password) => /[0-9]/.test(password), {
                message: "Password must contain at least one number",
            })
            .refine((password) => /[!@#$%^&*]/.test(password), {
                message: "Password must contain at least one special character (!@#$%^&*)",
            })
    })

    const parsedData = requiredBody.safeParse(req.body);

    if (!parsedData.success) {
        const formattedErrors = parsedData.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
        }));
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: formattedErrors
        });
    };

    const { userName, password, lastName, firstName } = parsedData.data;

    try {
        const userExisted = await UserModel.findOne({ userName });

        if (userExisted) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.create({
            userName,
            password: hashedPassword,
            lastName,
            firstName
        });

        return res.status(201).json({
            success: true,
            message: "You are signed up!"
        });

    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong during signup"
        });
    }
});