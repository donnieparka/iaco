import express from "express";
import asyncWrapper from "../utils/asyncWrapper.js";
import User from "../models/user.js";
import passport from "passport";
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

usersRouter.get("/login", (req, res) => {
  res.render("user/login");
});

usersRouter.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/user/login",
  }),
  (req, res) => {
    req.flash(
      "success",
      "ciao coglione vai ancora a dormire in tenda come i barboni?"
    );
    res.redirect("/campgrounds");
  }
);
export default usersRouter;
