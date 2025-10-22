import express from "express";
import { userRouter } from "./routes/user.route.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/v1", userRouter)

mongoose
    .connect(process.env.MONGODB_URI as string)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server Running on Port: http://localhost:${process.env.PORT}`)
        })
    }).catch((e) => console.log(`${e} did not connect!!`))

