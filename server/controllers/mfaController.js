const User = require("../models/user");

exports.toggleMFA = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    await user.mfaEnabled(!user.mfaEnabled);
    await user.save();

    res.status(200).json({
      status: "success",
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
    const { email, otp, orgId } = req.body;

    if (!email || !otp || !orgId) {
      return res.status(400).json({
        success: false,
        error: "Please provide email, OTP and organization ID",
      });
    }

    const user = await User.findOne({
      email,
      orgId,
      mfaToken: otp,
      mfaTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired OTP",
      });
    }

    user.mfaToken = undefined;
    user.mfaTokenExpiry = undefined;
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
