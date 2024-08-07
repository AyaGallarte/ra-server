// [SECTION] Dependencies and Modules
const User = require("../models/User.js");
const Post = require("../models/Post.js");
// Importing auth.js
const auth = require("../auth.js");
const { errorHandler } = auth;
const mongoose = require('mongoose');

module.exports.addPost = async (req, res) => {

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).send('User not found');

  const { title, content } = req.body;

  const newPost = new Post({
    title, 
    content,
    userId: user.id,
    author: user.username
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).send(savedPost);
  } catch (error) {
    res.status(500).send({ message: 'Error adding post', error });
  }
};

module.exports.getPosts = (req, res) => {
  return Post.find({ userId: req.user.id })
    .then(posts => {
      if (posts.length > 0) {
        return res.status(200).send({ posts: posts });
      }
      return res.status(404).send({
        error: 'No posts found'
      });
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.getPost = (req, res) => {

    Post.findById(req.params.postId)
    .then(result => res.status(200).send(result))
    .catch(err => errorHandler(err, req, res));
};

module.exports.updatePost = (req, res) => {

    let postUpdate = {
        title: req.body.title,
        content: req.body.content
    }

    return Post.findByIdAndUpdate(req.params.postId, postUpdate, {
    new: true,
  })
    .then((post) => {
      if (post) {
        res.status(200).send({
          message: "Post updated successfully",
          updatedPost: post
        })
      } else {
        res.status(404).send({ message: "Post update failed" })
      }
    })
    .catch((error) => errorHandler(error, req, res))
};


module.exports.deletePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id; // Assuming req.user contains the authenticated user's ID
  const isAdmin = req.user.isAdmin; // Assuming req.user contains the isAdmin flag

  try {
    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    // Check if the userId of the post matches the userId of the requester or if the user is an admin
    if (post.userId.toString() !== userId && !isAdmin) {
      return res.status(403).send({ message: "You do not have permission to delete this post" });
    }

    // If they match or user is an admin, delete the post
    await Post.findByIdAndDelete(postId);

    res.status(200).send({
      message: "Post deleted successfully",
      deletedPost: post
    });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting post', error });
  }
};


module.exports.addComment = (req, res) => {

  const { postId } = req.params;
     const { comments } = req.body;

     const newComment = {
         userId: req.user.id,
         username: req.user.email,
         comments: comments
     };

     Post.findByIdAndUpdate(
         postId,
         { $push: { comments: newComment } },
         { new: true }
     )
     .then((post) => {
         if (post) {
             res.status(200).send({
                 message: "comment added successfully",
                 updatedPost: post
             });
         } else {
             res.status(404).send({ message: "Post not found" });
         }
     })
     .catch((error) => errorHandler(error, req, res));
};

module.exports.getComments = (req, res) => {

  const comments = [];

    Post.findById(req.params.postId)
    .then(post => {
      if (post) {
        res.status(200).send({
          comments: post.comments
        })
      } else {
        res.status(404).send({ message: "Post not found" });
      }
    })
    .catch(err => errorHandler(err, req, res));
};

