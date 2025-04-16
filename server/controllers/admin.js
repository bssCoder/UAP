const Organization = require("../models/organization");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || user.role !== "admin") {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials or not an admin",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }
    user.loginHistory.unshift({ timestamp: new Date() });

    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        orgId: user.orgId,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );
    const organization = await Organization.findById(user.orgId);
    res.cookie("uapToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None", // crucial for cross-domain SSO
      domain: ".vercel.app", // works across *.vercel.app domains
      path: "/",
    });
    
    res.status(200).json({
      success: true,
      token,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        organization: organization,
        orgId: user.orgId,
        access: user.access,
        loginHistory: user.loginHistory,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { email, password, orgId, role, access, name } = req.body;

    if (!email || !password || !orgId || !name) {
      return res.status(400).json({
        success: false,
        error: "Please provide all required fields",
      });
    }

    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(400).json({
        success: false,
        error: "Organization not found",
      });
    }

    const existingUser = await User.findOne({
      orgId,
      email,
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      orgId,
      role,
      name,
      access: access || [],
      mfaEnabled: false,
      loginHistory: [],
    });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        orgId: user.orgId,
        access: user.access || [],
        mfaEnabled: user.mfaEnabled,
        loginHistory: user.loginHistory,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const orgId = req.user.orgId;
    const users = await User.find({ orgId });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user before deleting to verify they exist
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check if user is in the same organization as the admin
    if (targetUser.orgId.toString() !== req.user.orgId.toString()) {
      return res.status(403).json({
        success: false,
        error: "You can only delete users in your organization",
      });
    }

    // Prevent deletion of last admin
    if (targetUser.role === "admin") {
      const adminCount = await User.countDocuments({
        orgId: req.user.orgId,
        role: "admin",
      });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          error: "Cannot delete the last admin user",
        });
      }
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.toggleUserMfa = async (req, res) => {
  try {
    const { userId, enabled } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    targetUser.mfaEnabled = enabled;
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: `MFA ${enabled ? "enabled" : "disabled"} successfully`,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({
        success: false,
        error: "User ID and role are required",
      });
    }

    if (!["user", "developer", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        error: "Invalid role specified",
      });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check if user is in the same organization as the admin
    if (targetUser.orgId.toString() !== req.user.orgId.toString()) {
      return res.status(403).json({
        success: false,
        error: "You can only update users in your organization",
      });
    }

    targetUser.role = role;
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: `Role updated successfully to ${role}`,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateAccess = async (req, res) => {
  try {
    const { userId, access } = req.body;

    if (!userId || !Array.isArray(access)) {
      return res.status(400).json({
        success: false,
        error: "User ID and access array are required",
      });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check if user is in the same organization as the admin
    if (targetUser.orgId.toString() !== req.user.orgId.toString()) {
      return res.status(403).json({
        success: false,
        error: "You can only update users in your organization",
      });
    }

    targetUser.access = access;
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: "Access permissions updated successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
