const mongoose = require("mongoose");

const accessGrantSchema = new mongoose.Schema(
  {
    // The user who owns the records and is granting access (the patient)
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // The user who is being granted access (the doctor/guardian)
    grantee: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // The status of the grant
    status: {
      type: String,
      required: true,
      enum: ["pending", "active", "revoked"],
      default: "pending",
    },
    // Defines what the grantee can do. For now, it's just read-only.
    permissions: {
      type: String,
      required: true,
      enum: ["read-only"],
      default: "read-only",
    },
  },
  {
    timestamps: true,
  }
);

// To prevent duplicate grant requests, we ensure that the combination of
// an owner and a grantee is unique.
accessGrantSchema.index({ owner: 1, grantee: 1 }, { unique: true });

module.exports = mongoose.model("AccessGrant", accessGrantSchema);
