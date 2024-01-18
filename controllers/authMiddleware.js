const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, "hd", (err, decodedToken) => {
      if (err) {
        res.redirect("/course9");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/course9");
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  try {
    if (token) {
      jwt.verify(token, "hd", async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          next();
        } else {
            let user = await User.findById(decodedToken.id);
            req.user = user;
            res.locals.user = user;
            next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  } catch (err) {
    console.log(err, "yippedyda");
  }
};

module.exports = { requireAuth, checkUser };
