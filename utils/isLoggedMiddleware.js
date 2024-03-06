const authentication = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "loggati maiale o non pubblichi una minchia");
    return res.redirect("/user/login");
  }
  next();
};

export default authentication;
