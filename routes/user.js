import express from 'express';
import { storeReturnTo, asyncWrapper } from '../utils/middlewares.js';
import passport from 'passport';
import {
	logInUser,
	logOutUser,
	registerUser,
	renderLogInForm,
	renderRegisterForm,
} from '../controllers/userControllers.js';
const usersRouter = express.Router();

// prettier-ignore
usersRouter.route("/register")
  .get(renderRegisterForm)
  .post(asyncWrapper(registerUser));

// prettier-ignore
usersRouter.route("/login")
  .get(renderLogInForm)
  .post(storeReturnTo,passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/user/login",
    }),
    logInUser
  );

usersRouter.get('/logout', logOutUser);

export default usersRouter;
