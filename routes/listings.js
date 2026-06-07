import express from "express";
import ExpressError from "../utils/ExpressError.js";
import wrapAsync from "../utils/wrapAsync.js";

import multer from "multer";
import {cloudinary,storage} from "../cloudConfig.js";

const upload = multer({storage});

import { isLoggedIn, isOwner, validateListings, normalizeCategories} from "../middleware.js";

const router = express.Router({ mergeParams: true });

// controllers
import {
  index,
  renderNewForm,
  showListings,
  createListings,
  renderEditForm,
  updateListing,
  destroyListing,
} from "../controllers/listings.js";


router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isLoggedIn, 
    upload.single("listing[image]"),
    normalizeCategories,
    validateListings,
    wrapAsync(createListings)
  );



// new listing create route
router.get("/new", isLoggedIn, renderNewForm);

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm));


router
  .route("/:id")
  .get(wrapAsync(showListings))
  .put(isLoggedIn, isOwner, upload.single("listing[image]"),normalizeCategories,validateListings, wrapAsync(updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(destroyListing));

export default router;
