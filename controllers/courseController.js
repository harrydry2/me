const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(`${process.env.STRIPESK}`);
const path = require("path");
const dbcourseVids = require("../scripts/courseVids");

const Users = mongoose.model("Users");

const createToken = (id) => jwt.sign({ id }, "hd", { expiresIn: "3d" });

exports.course9 = async (req, res) => {
  console.log(req.query);
  res.render("./course9/ext", {});
};

exports.course10 = async (req, res) => {
  try {
    // new user check
    if (req.query.session_id) {
      const session = await stripe.checkout.sessions.retrieve(
        req.query.session_id
      );
      const { email } = session.customer_details;
      const { payment_link } = session;
      const user = await Users.create({ email, bought: payment_link });
      // cookie and json web token
      console.log(user._id);
      const token = createToken(user.email);
      res.cookie("jwt", token);
      console.log(token, "mmm");
      // auth user
      // send email with course details :)
    }
    res.render("./course10/ext", {
      matchingSlug: {
        id: 1,
        title: "Six hours in London",
        slug: "six-hours-in-london",
        vidid: 888258161,
      },
    });
  } catch (err) {
    console.log(err);
  }
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
      "http://localhost:7777/course10?session_id={CHECKOUT_SESSION_ID}",
    line_items: [{ price: "price_1OHBPLDCQDrt6ruzj0SWnslN", quantity: 1 }],
    mode: "payment",
    cancel_url: "http://localhost:7777/course9",
  });
  // console.log(session, "che");
  res.redirect(session.url);
};
