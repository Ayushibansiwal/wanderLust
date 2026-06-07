import dotenv from "dotenv";
if(process.env.NODE_ENV != "production"){
    dotenv.config();
}

import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";

import ExpressError from "./utils/ExpressError.js";

import listingRouter from "./routes/listings.js";
import reviewRouter from "./routes/reviews.js";
import userRouter from "./routes/user.js";

import User from "./models/user.js";
import { cloudinary } from "./cloudConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8000;
const dbUrl = process.env.ATLASDB_URL;

// MongoDB Connection
async function main() {
    await mongoose.connect(dbUrl); 
}

main()
    .then(() => {
        console.log("MongoDB Connected Successfully");

        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });


const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})

// Session Configuration
const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.use(session(sessionOptions));
app.use(flash());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);

// 404 Route
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Error Handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;

    res.status(statusCode).render("listings/error.ejs", {
        err,
    });
});
