const router = require("express").Router();
const Notification = require("../models/Notification");
const verify = require("../middleware/authMiddleware");


// ================= GET MY NOTIFICATIONS =================
router.get("/", verify, async (req, res) => {
  try {
    const data = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(data);

  } catch (err) {
    res.status(500).json("Error fetching notifications");
  }
});


// ================= GET UNREAD COUNT (🔔 BADGE) =================
router.get("/count", verify, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user.id,
      read: false
    });

    res.json({ count });

  } catch (err) {
    res.status(500).json("Error fetching count");
  }
});


// ================= MARK AS READ =================
router.put("/read/:id", verify, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json("Marked as read");

  } catch (err) {
    res.status(500).json("Error updating notification");
  }
});


// ================= MARK ALL AS READ (OPTIONAL BONUS) =================
router.put("/read-all", verify, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, read: false },
      { read: true }
    );

    res.json("All marked as read");

  } catch (err) {
    res.status(500).json("Error updating notifications");
  }
});

module.exports = router;