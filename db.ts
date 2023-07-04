const mongoose = require("mongoose");
// const dotenv = require("dotenv");
dotenv.config();

// const MONGODB_URL = encodeURI(process.env.MONGODB_URL);
const MONGODB_URL = process.env.MONGODB_URL!;

// connect to mongodb
function connectToMongoDB() {
  mongoose.connect(MONGODB_URL);
  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB successfully");
  });

  mongoose.connection.on("error", (err:any) => {
    console.log("Error connecting to MongoDB", err);
  });
}

module.exports = { connectToMongoDB };
