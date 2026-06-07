import User from "../models/user.js";

export const  renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

export const signup =  async(req,res)=>{
    try {
        let {username, email, password} = req.body ;
        const newUser = new User({
            email,username
        });

        const registerUser = await User.register(newUser,password);
        req.login(registerUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Wecome to WanderLust");
            res.redirect("/listings");
        });
    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/signup");
    }
    
};

export const renderLoginForm =  (req,res)=>{
    res.render("users/login.ejs");
};

export const login =  async(req,res)=>{
        req.flash("success","Welcome to WanderLust");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
};

export const  logout =  (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are Logged Out Successfully.");
        res.redirect("/listings");
    });
};