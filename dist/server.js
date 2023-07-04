"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const url_route_1 = __importDefault(require("./routes/url.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// middlewares:
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.set("view engine", "ejs");
require("./db").connectToMongoDB();
// routes:
// app.use('/url', requireAuth , urlRouter)
app.use("/url", url_route_1.default);
app.use("/user", user_route_1.default);
app.get("/", (req, res) => {
    res.send("Welcome to the scissors server");
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Port running at ${PORT}`);
});
