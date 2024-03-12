import express from "express";
import { storeReturnTo, asyncWrapper } from "../utils/middlewares.js";
import passport from "passport";
import {
  logInUser,
  registerUser,
  renderLogInForm,
  renderRegisterForm,
} from "../controllers/userControllers.js";
const usersRouter = express.Router();

usersRouter.get("/register", renderRegisterForm);

usersRouter.post("/register", asyncWrapper(registerUser));

usersRouter.get("/login", renderLogInForm);

usersRouter.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/user/login",
  }),
  logInUser
);

usersRouter.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash(
      "success",
      "speriamo tu abbia comprato qualcosa stavolta taccagno di merda"
    );
    res.redirect("/campgrounds");
  });
});

export default usersRouter;
