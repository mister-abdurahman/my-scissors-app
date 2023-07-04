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
const url_model_1 = __importDefault(require("../models/url.model"));
const urlRouter = express_1.default.Router();
urlRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allURLS = yield url_model_1.default.find();
    // return res.status(200).json({ allURLS });
    res.render("index", { allURLS: allURLS });
}));
urlRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield url_model_1.default.create({ initial_url: req.body.initial_url });
    res.redirect("/url");
    // return res.status(200).json({ url });
}));
// route to the url when clicked:
urlRouter.get("/:shortUrl", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const shortUrl = yield url_model_1.default.findOne({
        shortened_url: req.params.shortUrl,
    });
    if (shortUrl == null)
        return res.sendStatus(404);
    shortUrl.clicks++;
    shortUrl.save();
    // return res.status(200).json({ shortUrl });
    res.redirect(shortUrl.initial_url);
}));
exports.default = urlRouter;
