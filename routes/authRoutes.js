const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Otp = require("../models/OTP");
const twilio = require("twilio");

const router = express.Router();

// ✅ Initialize Twilio Client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// ✅ Request OTP (via Twilio)
router.post("/request-otp", async (req, res) => {
  const { phone } = req.body;

  try {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send OTP via Twilio SMS
    await twilioClient.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    // Store OTP in database (overwrite existing)
    await Otp.findOneAndUpdate({ phone }, { otp }, { upsert: true });

    res.json({ message: "OTP sent successfully", otp });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
});

// ✅ Verify OTP & Create Account
router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;

  try {
    // Check if OTP is valid
    const otpRecord = await Otp.findOne({ phone, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Delete OTP after verification
    await Otp.deleteOne({ phone });

    // Find user by phone number
    let user = await User.findOne({ phone });

    if (!user) {
      // Create a new user if they don't exist
      user = await User.create({ phone, isVerified: true });
    } else {
      // Mark existing user as verified
      user.isVerified = true;
      await user.save();
    }

    res.json({ message: "OTP verified successfully", user });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Error verifying OTP", error: error.message });
  }
});



router.post("/set-password", async (req, res) => {
  const { phone, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the password to the user's record
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password set successfully" });
  } catch (error) {
    console.error("Error setting password:", error);
    res.status(500).json({ message: "Error setting password", error: error.message });
  }
});



// ✅ Sign In with Phone & Password
router.post("/signin", async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Sign-in successful", token, user });
  } catch (error) {
    res.status(500).json({ message: "Error signing in", error });
  }
});

module.exports = router;
