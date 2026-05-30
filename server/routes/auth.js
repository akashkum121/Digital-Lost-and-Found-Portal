const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

//  EMAIL TRANSPORT
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ================= TEST ROUTE =================
router.get("/test", (req, res) => {
  res.send("Auth working");
});

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json("Invalid Email Format");

    if (!/^[0-9]{10}$/.test(mobile))
      return res.status(400).json("Mobile must be 10 digits");

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { mobile }]
    });

    if (existingUser)
      return res.status(400).json("User already exists");

    const newUser = new User({
      name,
      email: email.toLowerCase().trim(),
      mobile,
      password
    });

    await newUser.save();

    res.json("Registered Successfully");

  } catch (err) {
    res.status(400).json(err.message);
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (!user)
      return res.status(400).json("Invalid Credentials");

    if (password !== user.password)
      return res.status(400).json("Invalid Credentials");

    const token = jwt.sign(
      { id: user._id, name: user.name },
      "secretkey",
      { expiresIn: "1h" }
    );

    res.json({
      token,
      name: user.name,
      userId: user._id
    });

  } catch (err) {
    res.status(400).json(err.message);
  }
});

// ================= FORGOT PASSWORD (FIXED ) =================
router.post("/forgot-password", async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();

    console.log("SEARCH EMAIL:", email);

    //  CASE INSENSITIVE SEARCH
    const user = await User.findOne({
      email: { $regex: new RegExp("^" + email + "$", "i") }
    });

    console.log("USER FOUND:", user);

    if (!user)
      return res.status(400).json("User not found");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.resetOTPExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    await transporter.sendMail({
      from: `"Lost & Found" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family:sans-serif">
          <h2>Password Reset OTP</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing:4px">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `
    });

    console.log("OTP:", otp);

    res.json("OTP sent to email");

  } catch (err) {
    console.log("MAIL ERROR:", err);
    res.status(400).json(err.message);
  }
});

// ================= RESET PASSWORD =================
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetOTP: otp,
      resetOTPExpire: { $gt: Date.now() }
    });

    if (!user)
      return res.status(400).json("Invalid or Expired OTP");

    user.password = newPassword;
    user.resetOTP = undefined;
    user.resetOTPExpire = undefined;

    await user.save();

    res.json("Password Reset Successful");

  } catch (err) {
    res.status(400).json(err.message);
  }
});

module.exports = router;