const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  title: {
    type: String,
    required: [true, "Post title is required"],
  },
  content: {
    type: String,
    required: [true, "Post content is required"],
  },
   author: {
    type: String,
    ref: "User"
  },
   createdOn: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: {
        type: String,
        ref: "User"
      },
      comments: {
        type: String
      },
      id: {
        type: mongoose.Schema.Types.ObjectId
      },
      commentDate: {
        type: Date,
        default: Date.now,
      }
    }
  ]
});

module.exports = mongoose.model("Post", postSchema);
