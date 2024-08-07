const express = require("express");
const userController = require("../controllers/user.js");
const { verify, isLoggedIn, verifyAdmin } = require("../auth.js");
const router = express.Router();

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/details", verify, userController.getProfile);

// [SECTION] Export Route System
module.exports = router;