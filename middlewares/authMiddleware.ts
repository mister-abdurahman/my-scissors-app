const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config();

// const SECRET_KEY = process.env.SECRET_KEY;

export const requireAuth = (req: any, res: any, next: Function) => {
  const token = req.headers.cookie?.split('=')[1]

  if (token) {
    jwt.verify(
      token,
      "secret_key_exists",
      (err: any, decodedToken: any) => {
        if (err) {
          console.log(err.message);
          res.redirect("/user/login");
        } else {
          console.log(decodedToken);
          next();
        }
      }
    );
  } else {
    res.redirect("/user/login");
  }
};