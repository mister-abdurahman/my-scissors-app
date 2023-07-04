import express from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { createURL, createURLForUnregistered, homePage, qrcodeRenderPage, routeToURL } from "../controllers/url.controller";

const urlRouter = express.Router();

urlRouter.get("/:id", requireAuth, homePage);

urlRouter.post("/", createURLForUnregistered);

urlRouter.post("/:userId", requireAuth, createURL);

urlRouter.get('/qrcode/:id/:urlId', requireAuth, qrcodeRenderPage)

urlRouter.get("/:id/:shortUrl", routeToURL);

export default urlRouter;