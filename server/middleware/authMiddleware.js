const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    let token = null;

    // 🔥 Prefer Authorization: Bearer <token>
    const authHeader = req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 🔥 Fallback (agar kahin token header use ho raha ho)
    if (!token) {
      token = req.header("token");
    }

    if (!token) {
      return res.status(401).json("Access Denied");
    }

    const verified = jwt.verify(token, "secretkey"); // 🔥 same secret as login
    req.user = {
  id: verified._id || verified.id
};
    next();
  } catch (err) {
    console.log("TOKEN ERROR:", err.message);
    return res.status(401).json("Invalid Token");
  }
};