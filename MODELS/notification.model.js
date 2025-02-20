const mongoose = require("mongoose");

const notiSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
    },
    type: {
      type: String,
      enum: ["follow", "like"],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const notiModel = new mongoose.model("NOTI", notiSchema);
module.exports = notiModel;
