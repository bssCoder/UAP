const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
      select: false,
    },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please provide organization ID"],
      ref: "Organization",
    },
    role: {
      type: String,
      enum: ["admin", "user", "developer"],
      default: "user",
    },
    access: [
      {
        _id: false,
        type: Map,
        of: String,
        required: true,
      },
    ],
    loginHistory: [
      {
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    mfaEnabled: {
      type: Boolean,
      default: false,
    },
    mfaToken: {
      type: Number,
    },
    passwordResetToken: {
      type: Number,
    },
    passwordResetExpires: Date,
    mfaTokenExpiry: Date,
  },
  {
    timestamps: true,
  }
);
userSchema.index({ orgId: 1, email: 1 });

module.exports = mongoose.model("User", userSchema);
