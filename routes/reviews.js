import express from "express";
import ExpressError from "../utils/ExpressError.js";
import wrapAsync from "../utils/wrapAsync.js";

import {
  isLoggedIn,
  isOwner,
  isAuthor,
  validateReview,
} from "../middleware.js";

import {createReview, destroyReview} from "../controllers/reviews.js";

const router = express.Router({ mergeParams: true });

// Reviews
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

// Delete Reviews
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(destroyReview));

export default router;
