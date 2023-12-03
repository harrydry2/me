require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const errorHandlers = require("./controllers/errorController");

mongoose.Promise = global.Promise;
mongoose.connect(
  `mongodb+srv://harrydry:${process.env.PWORD}@gdmarketing-mxilm.mongodb.net/test`
);
require("./models/Cards.js");
require("./models/Ceg.js");
require("./models/User.js");

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
  res.locals.icon = (name) => fs.readFileSync(`./public/icons/${name}.svg`);
  res.locals.dump = (obj) => JSON.stringify(obj, null, 2);
  next();
});

app.use("/", routes);

app.use(errorHandlers.notFound);

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get("env") === "development") {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

const PORT = process.env.PORT || 7777;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
