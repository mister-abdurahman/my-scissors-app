"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_model_1 = __importDefault(require("../models/user.model"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const app = (0, express_1.default)();
const userRouter = express_1.default.Router();
app.use((0, cookie_parser_1.default)());
require("dotenv").config();
// jwt is in secs and cookie is in millisecs
const maxAge = 1 * 24 * 60 * 60;
const createToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, "secret_key_exists", { expiresIn: maxAge });
};
userRouter.get("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("signup");
}));
userRouter.get("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("login");
}));
userRouter.get("/home", authMiddleware_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("home");
}));
userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!email || !password || !firstName || !lastName) {
            throw new Error("Ensure you fill all the inputs correctly");
        }
        const newUser = new user_model_1.default({ firstName, lastName, email, password });
        yield newUser.save();
        const token = createToken(newUser._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.redirect("/user/login");
        // res.status(200).json({ newUser: newUser._id });
    }
    catch (error) {
        console.log(error.message);
        // alert(error.message)
        res.status(422).json({ status: "error", message: error.message });
    }
}));
userRouter.post("/login", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const user = yield user_model_1.default.login(email, password);
            const token = createToken(user._id);
            res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.redirect("/user/home");
            // res.status(200).json({ user: user._id });
        }
        catch (error) {
            res.status(400).json({ status: "error", message: error.message });
        }
    });
});
exports.default = userRouter;
// fix error handlin, then next up is authenticating routes with jwt auth.
//netninja #15: https://www.youtube.com/watch?v=SnoAwLP1a-0&list=PL4cUxeGkcC9iqqESP8335DA5cRFp8loyp
// JWT signing:
// Headers: tells the server what type of signature is being used (meta)
// Payload: used to identify the user (contains user id)
// Makes the token secure (like a stamp of authenticity)
