import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { mainRouter } from "./routes/index.route.js";
dotenv.config({path: "../.env"});

const app = express();
app.use(express.json());
app.use("/api/v1", mainRouter)

mongoose
    .connect(process.env.MONGODB_URI as string)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server Running on Port: http://localhost:${process.env.PORT}`)
        })
    }).catch((e) => console.log(`${e} did not connect!!`))

