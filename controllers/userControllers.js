import { User } from "../mongooseModels.js";

const renderRegisterForm = (req, res) => {
  res.render("user/register");
};

const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const user = new User({ username, email });
    const newUser = await User.register(user, password);
    req.login(newUser, (err) => {
      if (err) return next(err);
      req.flash(
        "success",
        `cazzo complimenti ${user.username} di merda finalmente ce l'hai fatta, pensavo non ce l'avresti mai fatta`
      );
      res.redirect("/campgrounds");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("register");
  }
};

const renderLogInForm = (req, res) => {
  res.render("user/login");
};

const logInUser = (req, res) => {
  const returnUrl = res.locals.returnTo || "/campgrounds";
  req.flash(
    "success",
    "ciao coglione vai ancora a dormire in tenda come i barboni?"
  );
  res.redirect(returnUrl);
};

export { renderRegisterForm, registerUser, renderLogInForm, logInUser };
