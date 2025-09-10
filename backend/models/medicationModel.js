const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    medicationName: {
      type: String,
      required: [true, "Please specify the medication name"],
    },
    dosage: {
      type: String,
      required: [true, "Please specify the dosage"],
    },
    frequency: {
      type: String,
      required: [true, "Please specify the frequency"],
    },
    reason: {
      type: String,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Medication", medicationSchema);
