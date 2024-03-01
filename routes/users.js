import express from "express";
import User from "../models/users.js";
const usersRouter = express.Router();

usersRouter.get("/register", (req, res) => {
  res.render("user/register");
});

export default usersRouter;
