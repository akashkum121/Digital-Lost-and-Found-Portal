const router = require("express").Router();
const Claim = require("../models/Claim");
const Item = require("../models/Item");
const verify = require("../middleware/authMiddleware");
const multer = require("multer");
const Notification = require("../models/Notification");

// ================= MULTER =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


// ================= CREATE CLAIM =================
router.post("/add", verify, upload.single("locationPhoto"), async (req, res) => {
  try {
    const newClaim = new Claim({
      itemId: req.body.itemId,
      claimantId: req.user.id,
      message: req.body.message,
      locationPhoto: req.file ? req.file.filename : null,
      status: "Pending"
    });

    await newClaim.save();

    res.json("Claim Request Sent Successfully");

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json("You already requested this item");
    }
    res.status(400).json(err.message);
  }
});


// ================= GET MY CLAIMS =================
router.get("/my", verify, async (req, res) => {
  try {
    const claims = await Claim.find({ claimantId: req.user.id })
      .populate({
        path: "itemId",
        select: "title description location images userId",
        populate: {
          path: "userId",
          select: "email username"
        }
      })
      .sort({ createdAt: -1 });

    res.json(claims);

  } catch (err) {
    res.status(500).json("Error fetching requests");
  }
});


// ================= OWNER CLAIMS =================
router.get("/owner", verify, async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user.id });
    const itemIds = items.map(item => item._id);

    const claims = await Claim.find({ itemId: { $in: itemIds } })
      .populate({
        path: "itemId",
        select: "title description images userId"
      })
      .populate({
        path: "claimantId",
        select: "name email"
      })
      .sort({ createdAt: -1 });

    res.json(claims);

  } catch (err) {
    res.status(400).json(err.message);
  }
});


// ================= ACCEPT CLAIM =================
router.put("/accept/:id", verify, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json("Claim not found");

    const item = await Item.findById(claim.itemId);

    if (item.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json("Not authorized");
    }

    await Claim.findByIdAndUpdate(req.params.id, {
      status: "Approved",
      reviewedAt: new Date()
    });

    await Item.findByIdAndUpdate(claim.itemId, {
      status: "claimed"
    });

    // 🔥 NOTIFICATION
    await Notification.create({
      userId: claim.claimantId,
      message: "🎉 Your claim has been approved!"
    });

    res.json("Claim Approved");

  } catch (err) {
    res.status(400).json(err.message);
  }
});


// ================= REJECT CLAIM =================
router.put("/reject/:id", verify, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json("Claim not found");

    const item = await Item.findById(claim.itemId);

    if (item.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json("Not authorized");
    }

    await Claim.findByIdAndUpdate(req.params.id, {
      status: "Rejected",
      reviewedAt: new Date()
    });

    // 🔥 NOTIFICATION
    await Notification.create({
      userId: claim.claimantId,
      message: "❌ Your claim has been rejected"
    });

    res.json("Claim Rejected");

  } catch (err) {
    res.status(400).json(err.message);
  }
});


// ================= OWNER HANDOVER =================
router.put("/handover/owner/:id", verify, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json("Claim not found");

    const item = await Item.findById(claim.itemId);

    if (item.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json("Not allowed");
    }

    claim.handoverByOwner = true;
    await claim.save();

    res.json("Owner confirmed");

  } catch (err) {
    res.status(400).json(err.message);
  }
});


// ================= USER HANDOVER =================
router.put("/handover/user/:id", verify, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json("Claim not found");

    if (claim.claimantId.toString() !== req.user.id.toString()) {
      return res.status(403).json("Not allowed");
    }

    claim.handoverByClaimant = true;
    await claim.save();

    // 🔥 FINAL COMPLETE
    if (claim.handoverByOwner && claim.handoverByClaimant) {
      await Item.findByIdAndUpdate(claim.itemId, {
        status: "completed"
      });
    }

    res.json("User confirmed");

  } catch (err) {
    res.status(400).json(err.message);
  }
});

module.exports = router;