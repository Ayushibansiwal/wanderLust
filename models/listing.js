import Review from "./reviews.js";
import mongoose from "mongoose";
import CATEGORIES from "../utils/categories.js";

const CATEGORY_NAMES = CATEGORIES.map(cat => cat.name);
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        url:String,
        filename:String
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{ 
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
   categories: {
    type: [{
        type: String,
        enum: CATEGORY_NAMES
    }],
    default: []
    }
});


// listing post middleware 
listingSchema.post("findOneAndDelete", async (listing) => {
   if(listing){
    // deleting listing -> deleting corresponding review in Review
      await Review.deleteMany({_id: {$in: listing.reviews}});
      console.log("deleted");
   }
});

const listing = mongoose.model("Listing",listingSchema);
export default listing;