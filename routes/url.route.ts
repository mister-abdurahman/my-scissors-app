const express = require("express");
const { requireAuth } = require("../middlewares/authMiddleware");
const {
  createURL,
  createURLForUnregistered,
  homePage,
  qrcodeRenderPage,
  routeToURL,
} = require("../controllers/url.controller");


const urlRouter = express.Router();

urlRouter.get("/:id", requireAuth, homePage);

urlRouter.post("/", createURLForUnregistered);

urlRouter.post("/:userId", requireAuth, createURL);

urlRouter.get('/qrcode/:id/:urlId', requireAuth, qrcodeRenderPage)

urlRouter.get("/:id/:shortUrl", routeToURL);

export default urlRouter;