const authencication = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "loggati maiale o non pubblichi una minchia");
    return res.redirect("/user/login");
  }
  next();
};

export default authencication;
