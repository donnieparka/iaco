import mongoose from "mongoose";
import express from "express";
import bcrypt from "bcrypt";
import loginMiddleware from "../utils/loginMiddleware.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import User from "../models/user.js";
const userRouter = express.Router();

/* creazione user */
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
    res.redirect("/user/login");
  })
);

/* log in */
userRouter.get("/login", (req, res) => {
  res.render("user/login");
});

userRouter.post(
  "/login",
  asyncWrapper(async (req, res) => {
    const { user, password } = req.body;
    const loggingUser = await User.findOne({ user });
    if (
      loggingUser &&
      (await bcrypt.compare(password, loggingUser.password)) === true
    ) {
      req.session.user_id = loggingUser._id;
      return res.redirect("/user/show");
    } else {
      return res.redirect("/user/login");
    }
  })
);

userRouter.get(
  "/show",
  loginMiddleware,
  asyncWrapper(async (req, res) => {
    if (req.session.user_id) {
      const loggedUser = await User.findById(req.session.user_id);
      return res.render("user/show", { loggedUser });
    } else {
      return res.send("tua madre puttana");
    }
  })
);

userRouter.patch("/", (req, res) => {
  req.session.destroy();
  res.redirect("/user/login");
});
export default userRouter;
