import Listing from "../models/listing.js";
import CATEGORIES from "../utils/categories.js";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({
  accessToken: mapToken,
});

export const index = async (req, res) => {
  let { category, search } = req.query;
  let query = {};
  
  if (search) {
    query.$or = [
      { location: { $regex: search, $options: "i" } },
      { title: { $regex: search, $options: "i" } }
    ];
  }

  if (category) {
    query.categories = category;
  }

  let allListings = await Listing.find(query);
  res.render("listings/index.ejs", { 
    allListings, 
    CATEGORIES, 
    selectedCategory: category 
  });
};

export const renderNewForm = (req, res) => {
  res.render("listings/new.ejs",{CATEGORIES});
};

export const showListings = async (req, res) => {
  let { id } = req.params;
  const listingData = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listingData) {
    req.flash("error", "Listing does not exist.");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing: listingData,CATEGORIES });
};

export const createListings = async (req, res) => {
  let listingData = { ...req.body.listing };
  let response = await geocodingClient.forwardGeocode({
    query: listingData.location,
    limit: 1
  }).send();

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(listingData);

  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;

  await newListing.save();

  req.flash("success", "New Listing Created.");
  res.redirect("/listings");
};

export const renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listingData = await Listing.findById(id);

  if (!listingData) {
    req.flash("error", "Listing does not exist.");
    return res.redirect("/listings");
  }
  // Preview Listing
  let originalImageURL = listingData.image.url;
  originalImageURL = originalImageURL.replace("/upload", "/upload/w_250");

  res.render("listings/edit.ejs", { listing: listingData, originalImageURL,CATEGORIES });
};

export const updateListing = async (req, res) => {
  let { id } = req.params;
  let listingData = { ...req.body.listing };

  if (req.file) {
    listingData.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  const listing = await Listing.findByIdAndUpdate(
    id,
    listingData,
    { new: true, runValidators: true }
  );

  req.flash("success", "Listing Updated Successfully.");
  res.redirect(`/listings/${id}`);
};

export const destroyListing = async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  if (!deletedListing) {
    req.flash("error", "Listing does not exist.");
    return res.redirect("/listings");
  }
  req.flash("success", "Listing Deleted Successfully.");
  res.redirect("/listings");
};
