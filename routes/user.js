import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { isLoggedIn, saveRedirectUrl } from "../middleware.js";
import {
  signup,
  renderSignupForm,
  renderLoginForm,
  login,
  logout,
} from "../controllers/users.js";

const router = express.Router();

// signup

router
  .route("/signup")
  .get(renderSignupForm)
  .post(wrapAsync(signup));

router
  .route("/login")
  .get(renderLoginForm)
  .post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  login,
);

// Logout
router.get("/logout", logout);

export default router;
