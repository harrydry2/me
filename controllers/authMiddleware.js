const jwt = require("jsonwebtoken");

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

module.exports = { requireAuth };
