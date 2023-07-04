import express from "express";
import { loginUser, renderLogInPage, renderSignupPage, signupNewUser } from "../controllers/user.controller";

const app = express();
const userRouter = express.Router();

userRouter.get("/signup", renderSignupPage);

userRouter.get("/login", renderLogInPage);

// userRouter.get("/home", requireAuth, renderHomePage);

userRouter.post("/signup", signupNewUser);

userRouter.post("/login", loginUser);

export default userRouter;

// fix error handlin, then next up is authenticating routes with jwt auth.

//netninja #15: https://www.youtube.com/watch?v=SnoAwLP1a-0&list=PL4cUxeGkcC9iqqESP8335DA5cRFp8loyp

// JWT signing:
// Headers: tells the server what type of signature is being used (meta)
// Payload: used to identify the user (contains user id)
// Makes the token secure (like a stamp of authenticity)