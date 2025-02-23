const express = require("express");
const User = require("../models/User");

const router = express.Router();

// ✅ 1. Save Basic Details
router.post("/save-basic-details", async (req, res) => {
  const { phone, firstName, lastName, dob, gender } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { phone },
      { firstName, lastName, dob, gender },
      { new: true, upsert: true }
    );

    res.json({ message: "Basic details saved successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error saving basic details", error });
  }
});

// ✅ 2. Save Email
router.post("/save-email", async (req, res) => {
  const { phone, email } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { phone },
      { email },
      { new: true }
    );

    res.json({ message: "Email saved successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error saving email", error });
  }
});

// ✅ 3. Save PAN Number
router.post("/save-pan", async (req, res) => {
  const { phone, panNumber } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { phone },
      { panNumber },
      { new: true }
    );

    res.json({ message: "PAN Number saved successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error saving PAN number", error });
  }
});

module.exports = router;
