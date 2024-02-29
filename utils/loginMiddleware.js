import express from "express";
const loginMiddleware = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect("/user/login");
  }
  next();
};
export default loginMiddleware;
