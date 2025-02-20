const postModel = require("../MODELS/post.model");
const notiModel = require("../MODELS/notification.model");
const userModel = require("../MODELS/user.model");

const createPost = async (req, res, next) => {
  try {
    const { textStatus, img } = req.body;
    // next step -> take image and save the cloudinary url in db;
    const userId = req.user._id;
    const user = await userModel.findById(userId);
    if (!user) {
      return next({ statusCode: 404, message: "Create Account first." });
    }
    if (!textStatus || !img) {
      return next({ statusCode: 404, message: "Fields couldnot be empty" });
    }
    const newPost = new postModel({
      user: userId,
      text: textStatus,
      img,
    });
    await newPost.save();
    return res
      .status(201)
      .json({ error: false, message: "Post created successfully", newPost });
  } catch (error) {
    console.log("Error in createPost");
    next(error);
  }
};
const deletePost = async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (!post) {
      return next({
        statusCode: 404,
        message: "Something went wrong.Couldnot found Post.",
      });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return next({ statusCode: 500, message: "Unable to delete post" });
    }
    // also remove the image from the cloudinary
    await post.deleteOne();
    return res.status(200).json({ erro: false, message: "Post Deleted :)" });
  } catch (error) {
    console.log("Error in deletePost");
    next(error);
  }
};
const commentOnPost = async (req, res, next) => {
  try {
    const { commentPost } = req.body;
    const post = await postModel.findById(req.params.id);
    if (!post) {
      return next({ statusCode: 404, message: "Unable to find the post" });
    }
    if (!commentPost) {
      return next({ statusCode: 404, message: "Comment??" });
    }
    const comment = {
      text: commentPost,
      user: req.user._id,
    };
    post.comments.push(comment);
    await post.save();
    return res
      .status(200)
      .json({ error: false, message: "Comment Done", post });
  } catch (error) {
    console.log("Error in commenting on post");
    next(error);
  }
};
const likeOnPost = async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.id);
    const user = await postModel.findById(req.user._id);
    if (!post) {
      return next({ statusCode: 404, message: "Unable to find the post" });
    }
    const alreadyLiked = post.likes.includes(req.user._id);
    if (alreadyLiked) {
      await postModel.updateOne(req.params.id, {
        $pull: { likes: req.user._id },
      });

      await user.updateOne({
        $pull: {
          likedPost: req.params.id,
        },
      });

      await post.save();
      await user.save();

      return res.status(200).json({ error: false, message: "Unliked ." });
    } else {
      post.likes.push({
        user: req.user._id,
      });
      await user.updateOne({
        $push: {
          likedPost: req.params.id,
        },
      });

      await post.save();
      const notification = new notiModel({
        from: req.user._id,
        type: "like",
        to: post.user,
      });
      await notification.save();
      return res.status(200).json({ error: false, message: "liked" });
    }
  } catch (error) {
    console.log("Error in liking post");
    next(error);
  }
};
module.exports = { createPost, deletePost, commentOnPost, likeOnPost };
