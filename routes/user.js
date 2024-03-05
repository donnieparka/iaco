import express from "express";
import asyncWrapper from "../utils/asyncWrapper.js";
import User from "../models/user.js";
const usersRouter = express.Router();

usersRouter.get("/register", (req, res) => {
  res.render("user/register");
});

usersRouter.post(
  "/register",
  asyncWrapper(async (req, res) => {
    try {
      const { username, password, email } = req.body;
      const user = new User({ username, email });
      const newUser = await User.register(user, password);
      req.flash(
        "success",
        "cazzo complimenti imbecille finalmente sei riuscito a registrarti, pensavo non ce l'avresti mai fatta"
      );
      res.redirect("/campgrounds");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("register");
    }
  })
);
export default usersRouter;
