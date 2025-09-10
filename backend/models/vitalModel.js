const mongoose = require("mongoose");

const vitalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    recordDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    bloodPressure: {
      type: String,
    },
    heartRate: {
      type: Number, // Beats per minute
    },
    temperature: {
      type: Number, // In Celsius or Fahrenheit
    },
    bloodSugar: {
      type: String,
    },
    weight: {
      type: Number, // In kg or lbs
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vital", vitalSchema);
