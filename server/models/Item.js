const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    contact: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    images: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ["Lost", "Found", "claimed", "completed"],
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    //  NEW FIELD (IMPORTANT)
    lostDate: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", ItemSchema);
