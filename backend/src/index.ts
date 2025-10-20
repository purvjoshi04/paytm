import express from "express";
import { userRouter } from "./routes/user.route.js";

const app = express();
app.use("/api/v1", userRouter)

app.listen(2000);

console.log("done")

