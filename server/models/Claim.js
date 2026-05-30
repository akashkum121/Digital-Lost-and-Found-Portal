const mongoose = require("mongoose");

const ClaimSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true
  },

  claimantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  message: {
    type: String,
    required: true,
    trim: true
  },

  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },

  // 🔥 NEW: HANDOVER PROOF SYSTEM
  handoverByOwner: {
    type: Boolean,
    default: false
  },

  handoverByClaimant: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });


// 🔥 PREVENT DUPLICATE REQUESTS
ClaimSchema.index({ itemId: 1, claimantId: 1 }, { unique: true });

module.exports = mongoose.model("Claim", ClaimSchema);