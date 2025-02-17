const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    text: {
      type: String,
    },
    img: {
      type: String,
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
    comments: [
      {
        text: {
          type: String,
          default: "",
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
  },
  { timestamps: true }
);

const postModel = mongoose.model("POST", postSchema);

module.exports = postModel;
