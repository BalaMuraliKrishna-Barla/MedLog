const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    doctorName: {
      type: String,
      required: [true, "Please enter the doctor's name"],
    },
    specialty: {
      type: String,
    },
    purpose: {
      type: String,
      required: [true, "Please describe the purpose of the appointment"],
    },
    appointmentDateTime: {
      type: Date,
      required: [true, "Please specify the date and time of the appointment"],
    },
    location: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
