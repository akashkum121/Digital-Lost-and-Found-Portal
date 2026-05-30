const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dhtuuzcze",
  api_key: "582589634487797",
  api_secret: "R1PblLWFZUczTAuaJGhxoNY-J7s"
});

module.exports = cloudinary;