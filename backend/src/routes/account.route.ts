import { Router } from "express";
import { userMiddleware } from "../middleware/middleware.js";
import mongoose from "mongoose";
import { AccountModel } from "../db/db.js";

export const accountRouter = Router();

accountRouter.get("/balance", userMiddleware, async (req, res) => {
    const account = await AccountModel.findOne({
        userId: req.userId
    });

    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        });
    }

    res.json({
        balance: account!.balance
    })
});

accountRouter.post("/transfer", userMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    
    try {
        session.startTransaction();
        const { amount, to } = req.body;

        if (!amount || !to || amount <= 0) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid transfer details"
            });
        }

        const account = await AccountModel.findOne({ userId: req.userId }).session(session);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        const toAccount = await AccountModel.findOne({ userId: to }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid account"
            });
        }

        await AccountModel.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await AccountModel.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        await session.commitTransaction();
        res.json({
            message: "Transfer successful"
        });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({
            message: "Transfer failed"
        });
    } finally {
        session.endSession();
    }
});