import flash from "connect-flash";
import Listing from "./models/listing.js";
import Review from "./models/reviews.js";
import ExpressError from "./utils/ExpressError.js";
import schemas from "./schema.js";
const { ListingSchema, ReviewSchema } = schemas;

export  const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be Logged in!");
        return res.redirect("/login");
    }
    next();
};

export  const saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

export const isOwner = async (req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);

    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the owner of this listing.");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

// Listing Validation
export const validateListings = (req,res,next)=>{
    let {error} = ListingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

// review validation 
export const validateReview = (req, res, next) => {
    const { error } = ReviewSchema.validate(req.body);

    if (error) {
        req.flash("error", error.details[0].message);
        return res.redirect(`/listings/${req.params.id}`);
    }

    next();
};

export const isAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);

    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the author of this review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

export const normalizeCategories = (req, res, next) => {
  if (req.body.listing) {
    if (!req.body.listing.categories) {
      // If no checkbox is checked, default to an empty array
      req.body.listing.categories = [];
    } else if (typeof req.body.listing.categories === "string") {
      // If only one checkbox is checked, convert the string into an array
      req.body.listing.categories = [req.body.listing.categories];
    }
  }
  next();
};