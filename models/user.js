import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
});

userSchema.plugin(passportLocalMongoose.default);

const User = new mongoose.model("User",userSchema);
export default User;