import urlModel from "../models/url.model";
import userModel from "../models/user.model";
import qrcode from 'qrcode';
import NodeCache = require("node-cache");

type urlData = {
    id: string;
    initial_url: string;
    shortened_url: string;
    clicks: number;
    save: () => {};
  };

const cache = new NodeCache();

// render home page:
export async function homePage(req:any, res:any, next:any){
    const id = req.params.id
    const user = await userModel.findById(id)
    const urls = await urlModel.find({userId: user?.id})
    
    try {
        // return res.status(200).json({ allURLS });
        res.render("home", { user: user, urls: urls, error:undefined });
    } catch (error) {
        res.render("home", { user: user, urls: urls, error: error });
        next(error)
    }
}

// creating a short url for an unregistered user
export async function createURLForUnregistered(req:any,res:any,next:any){ 
    try {
        await urlModel.create({ initial_url: req.body.initial_url });
        res.redirect("/");
    } catch (error) {
        res.render("index", { allURLS: undefined, error: error });
        next(error)
    }  
}

// creating a short url for a registered user
export async function createURL(req:any, res:any, next:any){
    const id = req.params.userId;
    await urlModel.create({ initial_url: req.body.initial_url, userId: id, shortened_url: req.body.shortened_url });
    const user = await userModel.findById(id);
    const urls = await urlModel.find({userId: user?.id})
    
    try {
        res.render("home", {user: user, urls: urls, error: undefined});
    } catch (error) {
        res.render("home", {user: user, urls: urls, error: error});
        next(error)
    }
  }

// route to page for generating/generated qrcode:
export async function qrcodeRenderPage(req:any, res:any, next:any) {
   const urlId = req.params.urlId
   const urlData = await urlModel.findById(urlId)
   const url = urlData.initial_url
  
    try {
        qrcode.toDataURL(url, (err, dataURL) => {
          if (err) {
            console.error(err);
            next(err)
            res.status(500).send('Internal Server Error');
          } else {
            res.render('qrcode', { qrCodeDataURL: dataURL, url: urlData, error: undefined });
        }
    });
} catch (error) {
        res.render('qrcode', { qrCodeDataURL: undefined, url: urlData, error:error });
        next(error)
    }
}

// route to the url when clicked:
export async function routeToURL (req:any, res:any, next:any){
    const cacheKey = 'url'
    const cachedData:any = cache.get(cacheKey)

    if(cachedData){
        cachedData.clicks++
    }

    const shortUrl: urlData | null = await urlModel.findOne({
      shortened_url: req.params.shortUrl,
      userId: req.params.id
    });
    
    if (shortUrl == null) return res.sendStatus(404);

    try {
        shortUrl.clicks++;
        await shortUrl.save();
        res.redirect(shortUrl.initial_url);
    } catch (error) {
        res.render('404Page', {error:error})
        next(error)
    } 
    // return res.status(200).json({ shortUrl });
}

export async function noUserRouteToURL(req:any, res:any, next:any){
    // res.redirect('/')
    const cacheKey = 'url'
    const cachedData:any = cache.get(cacheKey)

    try{   
        // // console.log(cachedData)
        // if(cachedData){
        //     cachedData.clicks++;
        //     console.log(cachedData.clicks)
        //     cache.set(cacheKey, cachedData );
        //     res.redirect(cachedData.initial_url);
        // }else{
            const url: urlData | null = await urlModel.findById(req.params.urlId);
            // cache.set(cacheKey, url );
            if (url == null) return res.sendStatus(404);
            url.clicks++;
            await url.save();
            res.redirect(url.initial_url);
        // }
    }catch (error) {
        res.render('404Page', {error:error})
        next(error)
    } 
}