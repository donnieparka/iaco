import mongoose from "mongoose";
import express from "express";
import asyncWrapper from "../utils/asyncWrapper.js";
const userRouter = express.Router();

userRouter.get("/user/register", (req, res) => {
  res.render("register");
});

userRouter.post(
  "/user/register",
  asyncWrapper(async (req, res) => {})
);
