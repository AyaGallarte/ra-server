const express = require("express");
const postController = require("../controllers/post.js");
const { verify, isLoggedIn, verifyAdmin } = require("../auth.js");
const router = express.Router();
const User = require('../models/User');

router.post('/addPost', verify, postController.addPost);

router.get("/getPosts", verify, postController.getPosts);

router.get("/getPost/:postId", postController.getPost);

router.patch("/updatePost/:postId", verify, postController.updatePost);

router.delete("/deletePost/:postId", verify, postController.deletePost);

router.patch('/addComment/:postId', verify, postController.addComment);

router.get("/getComments/:postId", verify, postController.getComments);

// [SECTION] Export Route System
module.exports = router;