const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
  firstName: String,
  lastName: String,
  dob: String, // Store as a string (YYYY-MM-DD)
  gender: String,
  email: { type: String, unique: true, sparse: true },
  panNumber: { type: String, unique: true, sparse: true },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
