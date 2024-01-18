const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(`${process.env.STRIPESK}`);
const fs = require('fs');
const path = require("path");
const dbcourseVids = require("../scripts/courseVids");

const Users = mongoose.model("Users");

const createToken = (id) =>
  jwt.sign({ id }, "hd", { expiresIn: 60 * 24 * 60 * 60 });

exports.course9 = async (req, res) => {
  console.log(req.query);
  res.render("./course9/ext", {});
};

exports.justbought = async (req, res) => {
  try {
    if (req.query.session_id) {
      const session = await stripe.checkout.sessions.retrieve(
        req.query.session_id
      );
      const { email } = session.customer_details;
      const { payment_link } = session;
      const user = await Users.create({ email, bought: payment_link });
      // log user in
      const token = createToken(user._id);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 60 * 24 * 60 * 60 * 1000,
      });
      res.redirect(301, "/course10");
      // send email with course details :)
    } else {
      res.redirect(301, "/course9");
    }
  } catch (err) {
    console.log(err);
  }
};

// This is the /course route

exports.course10 = async (req, res) => {
  // If not logged in show buy page
  if (!req.user) {
    res.render("./course9/ext");
  } else {
    // If logged in display activeVideo
    const { lastVid } = req.user;
    res.redirect(`/course10/${lastVid}`);
  }
};

// This is the course/slug route

exports.coursePage = async (req, res) => {
  // Get the user
  const user = req.user;
  const completedVids = user.completedVidsLearn.length + user.completedVidsDo.length
  // Get the video
  const { slug } = req.params;
  if (req.query.t) {
    var timestamp = req.query.t.replace('s', '');
  } else {
    var timestamp = 0
  }
  const video = dbcourseVids.find((obj) => obj.slug === slug);
  const isthebarStuck = user.completedVidsLearn.includes(video.id) || user.completedVidsDo.includes(video.id) ? "true" : "false";
  // if video is learn 
  try {
    if (video.type === "learn") {
      await Users.findByIdAndUpdate(user._id, {
        $set: { 
          activeVidLearn: slug, 
          lastVid: slug 
        },
      });
    }
    if (video.type === "do") {
      await Users.findByIdAndUpdate(user._id, {
        $set: { 
          activeVidDo: slug, 
          lastVid: slug 
        },
      });
    }   
  } catch (err) {
    console.log(err, "err");
  }
  res.render("./course10/ext", {
    video,
    user,
    completedVids,
    isthebarStuck,
    timestamp
  });
};

exports.createCheckout = async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    success_url:
      "http://localhost:7777/justboughtthecourse?session_id={CHECKOUT_SESSION_ID}",
    line_items: [{ price: "price_1OHBPLDCQDrt6ruzj0SWnslN", quantity: 1 }],
    mode: "payment",
    cancel_url: "http://localhost:7777/course9",
  });
  // console.log(session, "che");
  res.redirect(session.url);
};

exports.vidended = async (req, res) => {
  const { slug } = req.body;
  const video = dbcourseVids.find((obj) => obj.slug === slug);
  // prep for redirect
  const { slug: redirectSlug } = dbcourseVids.find((obj) => obj.id === video.id + 1);
  try {
    // Update the user in the database
    if (video.type === "learn") {
      await Users.findByIdAndUpdate(req.user._id, {
        $addToSet: { completedVidsLearn: video.id },
      });
    }
    if (video.type === "do") {
      await Users.findByIdAndUpdate(req.user._id, {
        $addToSet: { completedVidsDo: video.id },
      });
    }
    res.json({ redirectUrl: `/course10/${redirectSlug}` });
  } catch (err) {
    console.log(err, "err");
  }
};

exports.coursesearch = async (req, res) => {
  const filePath = path.join(__dirname, '..', 'scripts', 'courseData.json');
  res.sendFile(filePath);
};