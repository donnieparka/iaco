import mongoose from "mongoose";
import express from "express";
import asyncWrapper from "../utils/asyncWrapper.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
const userRouter = express.Router();

userRouter.get("/register", (req, res) => {
  res.render("user/register");
});

userRouter.post(
  "/register",
  asyncWrapper(async (req, res) => {
    const { user, password } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const newUser = new User({
      user,
      password: hash,
    });
    await newUser.save();
    res.send(newUser);
  })
);

export default userRouter;
