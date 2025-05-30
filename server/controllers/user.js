const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/email");

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email, password and organization ID",
      });
    }

    const user = await User.findOne({ email }).select("+password");
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
        userId: user._id,
        message: "MFA code has been sent to your email",
      });
    }
    user.loginHistory.unshift({ timestamp: new Date() });

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
    res.cookie("uapToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "None",
      // domain: "localhost",
      domain: ".vercel.app",
      path: "/",
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        access: user.access,
        orgId: user.orgId,
        mfaEnabled: user.mfaEnabled,
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
        mfaEnabled: user.mfaEnabled,
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

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
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

exports.googleLogin = async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({
        success: false,
        error: "Email, organization ID and Google ID are required",
      });
    }

    let user = await User.findOne({
      $or: [{ email }, { googleId }],
    });

    if (!user) {
      res.status(400).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    user.loginHistory.unshift({ timestamp: new Date() });

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
    res.cookie("uapToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "None", // crucial for cross-domain SSO
      domain: "localhost", // works across *.vercel.app domains
      // domain: ".vercel.app", // works across *.vercel.app domains
      path: "/",
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        access: user.access,
        orgId: user.orgId,
        mfaEnabled: user.mfaEnabled,
        loginHistory: user.loginHistory,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.loginCookie = async (req, res) => {
  const token = req.cookies.uapToken;
  console.log(req.cookies);
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // replace with your real secret
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    return res.json({ user: user, token: token }); // decoded contains user info if encoded during login
  } catch (error) {
    // console.log(error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
