const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // This TTL index will automatically delete the document after 10 minutes (600 seconds)
    expires: 600,
  },
});

// Hash the OTP before saving to the database
otpSchema.pre("save", async function (next) {
  if (!this.isModified("otp")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(this.otp, salt);
  next();
});

module.exports = mongoose.model("Otp", otpSchema);
