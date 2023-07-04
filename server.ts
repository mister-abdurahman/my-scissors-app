const express = require("express");
const urlRouter = require("./routes/url.route");
const userRouter = require("./routes/user.route");
const dotenv = require("dotenv");
const urlModel = require("./models/url.model");
const rateLimit = require("express-rate-limit");
const helmet = require('helmet');
const cookieParser = require("cookie-parser");
const { requireAuth } = require("./middlewares/authMiddleware");
const { noUserRouteToURL } = require("./controllers/url.controller");
const NodeCache = require("node-cache");

dotenv.config();

const app = express();
const cache = new NodeCache();

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// middlewares:
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.set("view engine", "ejs");
require("./db").connectToMongoDB();

// routes:
// app.use('/url', requireAuth , urlRouter)
app.use("/url", urlRouter);
app.use("/user", userRouter);

app.get("/", async (req:any, res: any) => {
  // res.send("Welcome to the scissors server");
  console.log(req)
  const cacheKey = 'allUrls'
  const cachedData = cache.get(cacheKey)
  if(cachedData){
    res.render("index", { allURLS: cachedData, error: undefined });
  }
  else{
    const allURLS = await urlModel.find({userId: ''});
    cache.set(cacheKey, allURLS);
    res.render("index", { allURLS: allURLS, error: undefined });
  }
});

app.get("/unregistered/:urlId", noUserRouteToURL);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Port running at ${PORT}`);
});
