import mongoose from "mongoose";
import sampleListings from "./data.js";
import Listing from "../models/listing.js";
import Review from "../models/reviews.js";

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  console.log("Connection successful");

  await initDB();
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Review.deleteMany({});

  let listings = sampleListings.map((obj)=>({...obj,owner:'6a23b97d7b6c25fe77c2399c'}));
  
  await Listing.insertMany(listings);
  console.log("Inserted successfully");
};

main().catch(err => console.log(err));