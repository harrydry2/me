const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  bought: {
    type: String,
  },
  completedVidsLearn: {
    type: [String],
    default: [],
  },
  completedVidsDo: {
    type: [String],
    default: [],
  },
  activeVidLearn: {
    type: String,
    default: "890855810",
  },
  activeVidDo: {
    type: String,
    default: "888258161",
  },
  lastVid: {
    type: String,
    default: "888258161",
  },
});

module.exports = mongoose.model("Users", userSchema);
