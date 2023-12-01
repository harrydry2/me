const express = require('express');
const router = express.Router();
const mainController = require("../controllers/mainController");

// Do work here
router.get('/', mainController.home)
router.get("/api/postideas", mainController.postideas);

module.exports = router;