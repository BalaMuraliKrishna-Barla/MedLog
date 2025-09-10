const mongoose = require("mongoose");

const medicalEventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    eventType: {
      type: String,
      required: true,
      enum: ["Surgery", "Diagnosis", "Hospitalization", "Imaging", "Other"],
    },
    title: {
      type: String,
      required: [true, "Please provide a title for the event"],
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
    },
    doctorInvolved: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MedicalEvent", medicalEventSchema);
