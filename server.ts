import express, { Express } from "express";
import urlRouter from "./routes/url.route";
import userRouter from "./routes/user.route";
import dotenv from "dotenv";
import urlModel from "./models/url.model";
import rateLimit from "express-rate-limit";
import helmet from 'helmet';
import cookieParser from "cookie-parser";
import { requireAuth } from "./middlewares/authMiddleware";
import { noUserRouteToURL } from "./controllers/url.controller";
import NodeCache = require("node-cache");
dotenv.config();

const app: Express = express();
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

app.get("/", async (req, res) => {
  // res.send("Welcome to the scissors server");
  
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
