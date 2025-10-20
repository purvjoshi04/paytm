import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

mongoose.connect(process.env.MONGO_URL as string);

const UserSchema = new mongoose.Schema({
    userName: String,
    firstName: String,
    lastName: String,
    password: String
})

export const UserModel = mongoose.model('users', UserSchema);