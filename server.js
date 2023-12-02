require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const compression = require("compression");
const cookieParser = require("cookie-parser");

mongoose.Promise = global.Promise;
mongoose.connect(
  `mongodb+srv://harrydry:${
    process.env.PWORD
  }@gdmarketing-mxilm.mongodb.net/test`
);
require("./models/Cards.js");
// require("./models/Test.js");
// require("./models/Gifs.js");
// require("./models/GifsMob.js");
// require("./models/Ceg.js");
// require("./models/EmailsNum.js");
// require("./models/User.js");

const fs = require("fs");

const app = express();

const routes = require("./routes/index");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(compression());

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.locals.icon = name => fs.readFileSync(`./public/icons/${name}.svg`);
  res.locals.dump = obj => JSON.stringify(obj, null, 2);
  next();
});

app.use("/", routes);

const PORT = process.env.PORT || 7777;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))