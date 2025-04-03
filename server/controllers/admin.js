const Organization = require("../models/organization");
const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email });

    if (!user || !user.role === "admin") {
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

    const token = jwt.sign(
      {
        id: user._id,
        orgId: user.orgId,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );
    const organization = await Organization.findById(user.orgId);

    res.status(200).json({
      success: true,
      token,
      organization: organization,
      user: {
        email: user.email,
        name: user.name,
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

    const user = await User.create({
      email,
      password,
      orgId,
      role,
      name,
      access: access || [],
    });

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const query = { orgId: req.body.orgId };

    // Only admins can see all users
    if (!req.user.role === "admin") {
      return res.status(403).json({
        success: false,
        error: "Admin access required",
      });
    }

    const users = await User.find(query);
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
