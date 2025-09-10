const mongoose = require("mongoose");

const allergySchema = new mongoose.Schema(
  {
    // Link the record to the user who owns it
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    allergen: {
      type: String,
      required: [true, "Please specify the allergen"],
    },
    reaction: {
      type: String,
      required: [true, "Please describe the reaction"],
    },
    severity: {
      type: String,
      required: [true, "Please select the severity level"],
      enum: ["Mild", "Moderate", "Severe"], // Enforce specific values
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Allergy", allergySchema);
