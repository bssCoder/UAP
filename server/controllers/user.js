const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/email");

exports.loginUser = async (req, res) => {
  console.log("Login request received:", req.body);
  try {
    const { email, password, orgId } = req.body;
    console.log("Login attempt with email:", email, "and orgId:", orgId);
    if (!email || !password || !orgId) {
      return res.status(400).json({
        success: false,
        error: "Please provide email, password and organization ID",
      });
    }

    const user = await User.findOne({ email, orgId }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    if (user.mfaEnabled) {
      // Generate OTP
      const otp = crypto.randomInt(100000, 999999).toString();
      user.mfaToken = otp;
      user.mfaTokenExpiry = Date.now() + 2 * 60 * 1000;
      await user.save();

      await sendEmail(
        user.email,
        "Your MFA Code",
        `Your verification code is: ${otp}. This code will expire in 2 minutes.`
      );

      return res.status(200).json({
        success: true,
        requireMFA: true,
        message: "MFA code has been sent to your email",
      });
    }

    user.loginHistory.push({ timestamp: new Date() });
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        orgId: user.orgId,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        access: user.access,
        orgId: user.orgId,
        loginHistory: user.loginHistory,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { role, name } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (role) user.role = role;
    if (name) user.name = name;

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        access: user.access,
        orgId: user.orgId,
        loginHistory: user.loginHistory,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    user.passwordResetToken = otp;
    user.passwordResetExpires = Date.now() + 2 * 60 * 1000;
    await user.save();

    await sendEmail(
      user.email,
      "Password Reset OTP",
      `Your password reset code is: ${otp}. This code will expire in 2 minutes.`
    );

    res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your email",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      passwordResetToken: otp,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired OTP",
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email,
      passwordResetToken: otp,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired OTP",
      });
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
