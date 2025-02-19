const userModel = require("../MODELS/user.model");
const followUnfollowUser = async (req, res, next) => {
  try {
    const nextPerson = await userModel.findById(req.params.id);
    const me = await userModel.findById(req.user._id);
    if (nextPerson === me) {
      return next({
        statusCode: 404,
        message: "Couldnot follow/unfollow self.",
      });
    }
    if (!nextPerson || !me) {
      return next({ statusCode: 404, message: "couldnot found one." });
    }
    const isFollowing = me.following.find(
      (u) => u.following.toString() === req.params.id.toString()
    );
    if (isFollowing) {
      await userModel.findByIdAndUpdate(req.params.id, {
        $pull: { followers: req.user._id },
      });
      await userModel.findByIdAndUpdate(req.user._id, {
        $pull: { following: req.params.id },
      });
      return res.status(200).json({error:false,message:'User unfollowed success'})

    } else {
      await userModel.findByIdAndUpdate(req.params.id, {
        $push: { followers: req.user._id },
      });
      await userModel.findByIdAndUpdate(req.user._id, {
        $push: { following: req.params.id },
      });
      return res.status(200).json({error:false,message:'User followed success'})
    }
  } catch (error) {
    console.log("Error in following user");
    next(error);
  }
};
module.exports = { followUnfollowUser };
