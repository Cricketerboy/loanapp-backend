const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  password: { type: String },
  isVerified: { type: Boolean, default: false },
  firstName: String,
  lastName: String,
  dob: String, // Store as a string (YYYY-MM-DD)
  gender: String,
  email: { type: String, unique: true, sparse: true },
  panNumber: { type: String, unique: true, sparse: true },
});



module.exports = mongoose.model("User", userSchema);
