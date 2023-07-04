"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const shortid = require("shortid");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const urlSchema = new Schema({
    id: ObjectId,
    initial_url: { type: String, required: true },
    shortened_url: { type: String, required: true, default: shortid.generate },
    clicks: { type: Number, required: true, default: 0 },
});
// module.exports = mongoose.model('url', urlSchema);
exports.default = mongoose.model("url", urlSchema);
