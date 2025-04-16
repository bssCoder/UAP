const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.toggleMFA = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    user.mfaEnabled = !user.mfaEnabled;
    await user.save();
    res.status(200).json({
      status: "success",
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
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.verifyMFA = async (req, res) => {
  try {
    const { userId, token } = req.body;

    if (!userId || !token) {
      return res.status(400).json({
        success: false,
        error: "Please provide userId and token",
      });
    }

    const user = await User.findOne({
      _id: userId,
      mfaToken: token,
      mfaTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired token",
      });
    }

    user.mfaToken = undefined;
    user.mfaTokenExpiry = undefined;
    user.loginHistory.push({ timestamp: new Date() });
    await user.save();

    const jwtToken = jwt.sign(
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
      token: jwtToken,
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
