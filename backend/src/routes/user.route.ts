import { Router, type Request, type Response } from "express";
import z from "zod";
import { AccountModel, UserModel } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const userRouter = Router();

userRouter.post("/signup", async (req: Request, res: Response) => {
    const requiredBody = z.object({
        userName: z.string(),
        email: z.string().email(),
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

    const { userName, email, password, lastName, firstName } = parsedData.data;

    try {
        const userExisted = await UserModel.findOne({ email });

        if (userExisted) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            userName,
            email,
            password: hashedPassword,
            lastName,
            firstName
        });

        const userId = user._id;

        await AccountModel.create({
            userId,
            balance: 1 + Math.random() * 10000
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

userRouter.post("/signin", async (req, res) => {
    const signinSchema = z.object({
        email: z.string().email({ message: "Invalid email format" }),
        password: z.string().min(1, { message: "Password is required" })
    });
    try {

        const parsedData = signinSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: parsedData.error.issues
            });
        }

        const { email, password } = parsedData.data;

        const user = await UserModel.findOne({
            email: email,
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const passwordCompare = await bcrypt.compare(password, user.password as string);

        if (!passwordCompare) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.USER_JWT_SECRET!,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            success: true,
            message: "Signed in successfully",
            token: token,
            user: {
                id: user._id,
                email: user.email
            }
        })
    } catch (error) {
        console.error("Signin error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong during signin"
        });
    }
});

const updateBody = z.object({
    password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
});

userRouter.put("/", async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await UserModel.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
});

userRouter.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await UserModel.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
});