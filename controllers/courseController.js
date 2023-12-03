const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(`${process.env.STRIPESK}`);
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

exports.course10 = async (req, res) => {
  res.render("./course10/ext", {
    matchingSlug: {
      id: 1,
      title: "Six hours in London",
      slug: "six-hours-in-london",
      vidid: 888258161,
    },
  });
};

exports.coursePage = async (req, res) => {
  const { slug } = req.params;
  const matchingSlug = dbcourseVids.find((obj) => obj.slug === slug);
  console.log(matchingSlug, "sq");
  res.render("./course10/ext", {
    matchingSlug,
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
