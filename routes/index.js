const express = require('express');
const router = express.Router();

const mainController = require("../controllers/mainController");
const postController = require("../controllers/postController");
// const courseController = require("../controllers/courseController");
// const emailController2 = require("../controllers/emailController2");


// Homepage
router.get("/", mainController.home);
router.get("/:filter/:slug", postController.post);
router.get("/:filters", mainController.filters);
router.get("/api/getcontent", mainController.getcontent);
router.get("/api/getpCard", mainController.getpCard);
router.get("/api/postideas", mainController.postideas);
router.get("/api/lazy/:page/:filterParam", mainController.lazy);

// Newsletter
// router.get("/newsletter", emailController2.subscribePage);
// router.post("/api/subscribe", emailController2.subscribe);
// router.post("/api/subscribeCourse", emailController2.subscribeCourse);

// // CoursePage
// router.get("/course", mainController.course);
// router.get("/course9", courseController.course9);
// router.get("/createcheckout", courseController.createCheckout);
// router.get("/course10", courseController.course10);
// router.get("/course10/:slug", courseController.coursePage);

// // Inspiration
// router.get("/inspiration", mainController.fed);
// router.get("/api/lazyceg/:page/:filterParam", mainController.lazyCeg);
// router.get("/api/postceg", mainController.postceg);

// // Misc
// router.get("/rss", mainController.rss);
// router.get("/robots.txt", mainController.txt);
// router.get("/sitemap.xml", mainController.xml);


module.exports = router;