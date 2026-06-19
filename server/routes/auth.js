const express = require("express");
const User = require("../models/User");
const { generateToken, authMiddleware } = require("../middleware/auth");
const { sendOTPEmail } = require("../services/sendEmail");

const router = express.Router();

/*
========================================
SEND OTP
========================================
*/

router.post("/auth/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        error: "Email already registered",
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP temporarily
    global.otpStore = global.otpStore || {};

    global.otpStore[email] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    };

    // Send Email
    await sendOTPEmail(email, otp);

    res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

/*
========================================
REGISTER WITH OTP
========================================
*/

router.post("/auth/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      otp,
      goal,
      mode,
      age,
      weight,
      height,
    } = req.body;

    // Validation
    if (!name || !email || !password || !otp) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    // Check existing user
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        error: "Email already in use",
      });
    }

    // Check OTP exists
    if (!global.otpStore || !global.otpStore[email]) {
      return res.status(400).json({
        error: "OTP not found",
      });
    }

    const savedOTP = global.otpStore[email].otp;
    const expires = global.otpStore[email].expires;

    // Check OTP expiry
    if (Date.now() > expires) {
      delete global.otpStore[email];

      return res.status(400).json({
        error: "OTP expired",
      });
    }

    // Verify OTP
    if (otp !== savedOTP) {
      return res.status(400).json({
        error: "Invalid OTP",
      });
    }

    // Create User
    const user = await User.create({
      name,
      email,
      password,
      goal: goal || "maintenance",
      mode: mode || "veg",
      age: age || null,
      weight: weight || null,
      height: height || null,
    });

    // Remove OTP after successful registration
    delete global.otpStore[email];

    // Generate JWT Token
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

/*
========================================
LOGIN
========================================
*/

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
========================================
GET CURRENT USER
========================================
*/

router.get("/auth/me", authMiddleware, (req, res) => {
  res.json(req.user.toSafeObject());
});

/*
========================================
UPDATE PROFILE
========================================
*/

router.patch("/auth/profile", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      goal,
      mode,
      age,
      weight,
      height,
      state,
      region,
    } = req.body;

    const updates = {};

    if (name !== undefined) updates.name = name;
    if (goal !== undefined) updates.goal = goal;
    if (mode !== undefined) updates.mode = mode;
    if (age !== undefined) updates.age = age;
    if (weight !== undefined) updates.weight = weight;
    if (height !== undefined) updates.height = height;
    if (state !== undefined) updates.state = state;
    if (region !== undefined) updates.region = region;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    );

    res.json(user.toSafeObject());
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;

