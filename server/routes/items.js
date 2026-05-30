const router = require("express").Router();
const Item = require("../models/Item");
const verify = require("../middleware/authMiddleware");

const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");

// 🔥 STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// 🔥 SAFE USER ID FUNCTION (MAIN FIX)
const getUserId = (req) => {
  return req.user.id || req.user._id;
};

// 🔹 GET ALL ITEMS (HIDE claimed + completed + own)
router.get("/", verify, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(getUserId(req));

    const items = await Item.find({
      status: { $nin: ["claimed", "completed"] },
      userId: { $ne: userId }
    }).sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    console.log(err);
    res.status(500).json("Error fetching items");
  }
});

// 🔹 ADD ITEM
router.post("/add", verify, upload.array("images", 5), async (req, res) => {
  try {
    console.log("FILES:", req.files);

    const { title, description, location, contact, status, lostDate } = req.body;

    if (!title || !description || !location || !contact || !lostDate) {
      return res.status(400).json("All fields are required");
    }

    if (!/^\d{10}$/.test(contact)) {
      return res.status(400).json("Contact must be 10 digits");
    }

    const today = new Date().toISOString().split("T")[0];
    if (lostDate > today) {
      return res.status(400).json("Future date not allowed");
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json("At least one image required");
    }

    const imagePaths = req.files.map(file => file.filename);

    const newItem = new Item({
      title,
      description,
      location,
      contact,
      status,
      images: imagePaths,
      userId: new mongoose.Types.ObjectId(getUserId(req)), // 🔥 FIX
      lostDate
    });

    await newItem.save();
    res.json("Item Added Successfully");

  } catch (err) {
    console.log("ADD ERROR:", err);
    res.status(500).json("Error Adding Item");
  }
});

// 🔹 GET MY ITEMS
router.get("/my-items", verify, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(getUserId(req));

    const items = await Item.find({
      userId: userId
    }).sort({ createdAt: -1 });

    res.json(items);

  } catch (err) {
    console.log(err);
    res.status(500).json("Error fetching user items");
  }
});

// 🔹 UPDATE ITEM
router.put("/:id", verify, upload.array("images", 5), async (req, res) => {
  try {
    const userId = getUserId(req);

    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json("Item not found");

    if (item.userId.toString() !== userId.toString()) {
      return res.status(403).json("Not allowed");
    }

    const updatedData = {
      title: req.body.title || item.title,
      description: req.body.description || item.description,
      location: req.body.location || item.location,
      contact: req.body.contact || item.contact,
      status: req.body.status || item.status,
      lostDate: req.body.lostDate || item.lostDate,
    };

    if (req.files && req.files.length > 0) {
      updatedData.images = req.files.map(file => file.filename);
    }

    await Item.findByIdAndUpdate(req.params.id, updatedData);

    res.json("Item Updated Successfully");

  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json("Update failed");
  }
});

// 🔹 DELETE ITEM
router.delete("/:id", verify, async (req, res) => {
  try {
    const userId = getUserId(req);

    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json("Item not found");

    if (item.userId.toString() !== userId.toString()) {
      return res.status(403).json("Not allowed");
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json("Item Deleted Successfully");

  } catch (err) {
    console.log(err);
    res.status(500).json("Delete failed");
  }
});

module.exports = router;