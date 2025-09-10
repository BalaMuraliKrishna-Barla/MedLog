const mongoose = require("mongoose");

const vaccinationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    vaccineName: {
      type: String,
      required: [true, "Please specify the vaccine name"],
    },
    dateAdministered: {
      type: Date,
      required: [true, "Please provide the date of administration"],
    },
    administeredBy: {
      type: String,
      required: [true, "Please specify who administered the vaccine"],
    },
    dosage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vaccination", vaccinationSchema);
