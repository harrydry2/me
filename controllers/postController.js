const mongoose = require("mongoose");

const Cards = mongoose.model("Cards");
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

exports.post = async (req, res) => {
  // find specific card
  const { slug, filter } = req.params;
  if (validFilters.includes(filter)) {
    const card = await Cards.findOne({ slug });
    const page = req.params.page || 1;
    const limit = 120;
    const skip = limit * page - limit;
    const cards = await Cards.find().skip(skip).limit(limit);
    res.render(`./posts/ext/${slug}`, { card, cards });
  } else {
    res.status(404).send("Not Found");
  }
};
