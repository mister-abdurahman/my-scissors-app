"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// const SECRET_KEY = process.env.SECRET_KEY;
const requireAuth = (req, res, next) => {
    // console.log("jwt value is:", jwt)
    // console.log("req.cookies.jwt value is:", req.cookies?.jwt)
    var _a;
    if ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt) {
        jsonwebtoken_1.default.verify(req.cookies.jwt, "secret_key_exists", (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect("/user/login");
            }
            else {
                console.log(decodedToken);
                next();
            }
        });
    }
    else {
        res.redirect("/user/login");
    }
};
exports.requireAuth = requireAuth;
