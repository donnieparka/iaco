import express from "express";
import { storeReturnTo, asyncWrapper } from "../utils/middlewares.js";
import { User } from "../mongooseModels.js";
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
      req.login(newUser, (err) => {
        if (err) return next(err);
        req.flash(
          "success",
          `cazzo complimenti ${user.username} di merda finalmente sei riuscitu a registrarti, pensavo non ce l'avresti mai fatta`
        );
        res.redirect("/campgrounds");
      });
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
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/user/login",
  }),
  (req, res) => {
    const returnUrl = res.locals.returnTo || "/campgrounds";
    req.flash(
      "success",
      "ciao coglione vai ancora a dormire in tenda come i barboni?"
    );
    res.redirect(returnUrl);
  }
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
