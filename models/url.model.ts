const mongoose = require("mongoose");
const shortid = require("shortid");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const urlSchema = new Schema({
  id: ObjectId,
  userId: {type: String, default: ''},
  initial_url: { type: String, required: true },
  shortened_url: { type: String, required: true, default: shortid.generate },
  clicks: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now() },
});

// module.exports = mongoose.model('url', urlSchema);
export default mongoose.model("url", urlSchema);
