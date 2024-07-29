const mongoose = require("mongoose");
const path = require("path");

const Cards = mongoose.model("Cards");
const dbCards = require("../scripts/cards");
const Ceg = mongoose.model("Ceg");
const dbCeg = require("../scripts/ceg");

let shuffledCeg = [];

const validFilters = [
  "content",
  "seo",
  "sales",
  "social",
  "ads",
  "copywriting",
  "landing-page",
  "retention",
  "brand",
  "referral",
  "creative",
];

function findCommonElements(arr1, arr2) {
  return arr1.every((item) => arr2.includes(item));
}

function shuffleFisherYates(array) {
  let i = array.length;
  while (i--) {
    const ri = Math.floor(Math.random() * (i + 1));
    [array[i], array[ri]] = [array[ri], array[i]];
  }
  return array;
}

function isMobile(ua) {
  const mobileRE =
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;
  return mobileRE.test(ua);
}

exports.home = async (req, res) => {
  // get skip + limit
  const page = +req.params.page || 1;
  const limit = 100;
  const skip = limit * page - limit;
  const cards = await Cards.find().skip(skip).limit(limit);
  res.render("./home/ext", { cards });
};

exports.fed = async (req, res) => {
  shuffledCeg = shuffleFisherYates(dbCeg);
  shuffledCeg = dbCeg;
  const cegs = shuffledCeg.slice(0, 10);
  res.render("./fed/ext", { cegs });
};

exports.roast = async (req, res) => {
  res.render("./roast/ext");
};


exports.xml = async (req, res) => {
  res.contentType("application/xml");
  res.sendFile(path.join(__dirname, "sitemap.xml"));
};

exports.txt = async (req, res) => {
  res.contentType("text/plain");
  res.sendFile(path.join(__dirname, "robots.txt"));
};

exports.lazy = async (req, res) => {
  let cards;
  const { page } = req.params || 1;
  const { filterParam } = req.params;
  const limit = 120;
  const skip = limit * page - limit;
  if (filterParam === "all") {
    cards = await Cards.find().skip(skip).limit(limit);
  } else {
    const activeFilters = filterParam;
    cards = await Cards.find({ tBack: { $in: activeFilters } })
      .skip(skip)
      .limit(limit);
  }
  res.render("./backend/cards", { cards });
};

exports.lazyCeg = async (req, res) => {
  var cegs;
  var start;
  var end;
  const { page } = req.params || 1;
  const { filterParam } = req.params;
  if (parseInt(page) === 1) {
    end = 10;
    start = 0;
  } else {
    start = parseInt(page) * 6 + 4 - 6;
    end = parseInt(page) * 6 + 4;
  }
  const pageString = page.toString();
  if (filterParam === "beenDone") {
    cegs = shuffledCeg.slice(start, end);
  } else if (filterParam === "all") {
    cegs = shuffledCeg.slice(start + 10, end + 10);
  } else {
    const activeFilters = filterParam.split("-");
    const filteredCeg = shuffledCeg.filter((item) =>
      findCommonElements(activeFilters, item.filter)
    );
    cegs = filteredCeg.slice(start, end);
  }
  res.render("./backend/cegs", { cegs, pageString });
};

exports.getcontent = async (req, res) => {
  const { slug } = req.query;
  res.render(`./backend/posts/content/${slug}`);
};

exports.getpCard = async (req, res) => {
  const { slug } = req.query;
  const card = await Cards.findOne({ slug });
  res.render(`./backend/posts/pCard`, { card });
};

exports.postideas9 = async (req, res) => {
  await Cards.deleteMany({});
  await Cards.insertMany(dbCards);
  const cards = await Cards.find();
  res.json(cards);
};

exports.postceg = async (req, res) => {
  await Ceg.deleteMany({});
  await Ceg.insertMany(dbCeg);
  const ceg = await Ceg.find();
  res.json(ceg);
};

exports.filters = async (req, res) => {
  const { filters } = req.params;
  if (validFilters.includes(filters)) {
    const activeFilters = [filters];
    const page = req.params.page || 1;
    const limit = 120;
    const skip = limit * page - limit;
    const cards = await Cards.find({ tBack: { $in: activeFilters } })
      .skip(skip)
      .limit(limit);
    const smalltitle = activeFilters[0];
    let titlenum = "";
    let title;
    if (smalltitle === "content") {
      titlenum = "1";
    } else if (smalltitle === "seo") {
      titlenum = "2";
    } else if (smalltitle === "sales") {
      titlenum = "3";
    } else if (smalltitle === "social") {
      titlenum = "4";
    } else if (smalltitle === "ads") {
      titlenum = "5";
    } else if (smalltitle === "copywriting") {
      titlenum = "6";
    } else if (smalltitle === "landing-page") {
      titlenum = "7";
    } else if (smalltitle === "retention") {
      titlenum = "8";
    } else if (smalltitle === "brand") {
      titlenum = "9";
    } else if (smalltitle === "referral") {
      titlenum = "10";
    } else if (smalltitle === "creative") {
      titlenum = "11";
    }
    const toTitleCase = (phrase) =>
      phrase
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    if (smalltitle === "landing-page") {
      title = "Landing Page";
    } else {
      title = toTitleCase(smalltitle);
    }
    res.render("filters/ext", {
      cards,
      title,
      activeFilters,
      filters,
      titlenum,
    });
  } else {
    res.status(404).send("Not Found");
  }
};
