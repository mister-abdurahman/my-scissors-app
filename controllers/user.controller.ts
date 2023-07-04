import userModel from "../models/user.model";
import urlModel from "../models/url.model";
import jwt from "jsonwebtoken";

// app.use(cookieParser());
// require("dotenv").config();

// jwt is in secs and cookie is in millisecs
const maxAge = 1 * 24 * 60 * 60;
const createToken = (id: string) => {
  return jwt.sign({ id }, "secret_key_exists", { expiresIn: maxAge });
};

// render signup page 
export async function renderSignupPage(req:any, res: any, next:any){
    try {
        res.render("signup", {error: undefined});
    } catch (error) {
      res.render('index', { error:error, allURLS:undefined})
        next(error)
    }
} 

// render Log in page [GET]
export async function renderLogInPage(req: any, res: any, next: any) {
    try {
      res.render("login", {error: undefined});
    } catch (error) {
      res.render('index', { error:error, allURLS:undefined})
      next(error);
    }
  }

// render home page for registered users [GET]
// export async function renderHomePage (req:any, res:any, next:any) {
//    try {
//     res.render("home");
//    } catch (error) {
//     res.render('login', {error: error})
//     next(error)
//    }
//   }

// Signup new users [POST]
export async function signupNewUser (req:any, res:any, next:any) {
    try {
      const { firstName, lastName, email, password } = req.body;
  
      if (!email || !password || !firstName || !lastName) {
        throw new Error("Ensure you fill all the inputs correctly");
      }
      const newUser = new userModel({ firstName, lastName, email, password });
      await newUser.save();
      const token = createToken(newUser._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.redirect("/user/login");
      // res.status(200).json({ newUser: newUser._id });
    } catch (error: any) {
      console.log(error.message);
      res.render('signup', {error: error})
      // res.status(422).json({ status: "error", message: error.message });
      next(error)
    }
  }

//   Log in users [POST]
export async function loginUser (req:any, res:any, next:any) {
    const { email, password } = req.body;
    try {
      const user = await userModel.login(email, password);
      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      const urls = await urlModel.find({userId: user?._id})
      // res.redirect("/user/home");
      res.render('home', {user: user, urls: urls, error: undefined})
      // res.status(200).json({ user: user._id });
    } catch (error: any) {
        res.render('login', {error: error})
    //   res.status(400).json({ status: "error", message: error.message });
    }
  }