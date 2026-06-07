import Listing from "../models/listing.js";
import Review from "../models/reviews.js";

export const createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);

    let newReview = new Review({
        ...req.body.review
    });

    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created.");
    res.redirect(`/listings/${listing.id}`);
};


export const destroyReview = async(req,res)=>{
    let {id, reviewId} = req.params;

    // deleting review from Review
    await Review.findByIdAndDelete(reviewId);

    // deleting review from listing
    await Listing.findByIdAndUpdate(id,{$pull:{
        reviews:reviewId
    }});
    req.flash("success","Review Deleted Successfully.");
    res.redirect(`/listings/${id}`);
};