const mongoose = require("mongoose");
const path = require("path");

const Cards = mongoose.model("Cards");
const dbCards = require("../scripts/cards");

exports.home = async (req, res) => {
    // get skip + limit
    const page = +req.params.page || 1;
    const limit = 12;
    const skip = limit * page - limit;
    const cards = await Cards.find()
      .skip(skip)
      .limit(limit);
    res.render("./home/ext");
  };

  exports.postideas = async (req, res) => {
    await Cards.deleteMany({});
    await Cards.insertMany(dbCards);
    const cards = await Cards.find();
    res.json(cards);
  };