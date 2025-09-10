const Appointment = require("../models/appointmentModel");

// @desc    Get all appointments for a user
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
  try {
    // Sort by the appointment date in ascending order
    const appointments = await Appointment.find({ user: req.user.id }).sort({
      appointmentDateTime: 1,
    });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  try {
    const { doctorName, purpose, appointmentDateTime } = req.body;
    if (!doctorName || !purpose || !appointmentDateTime) {
      res.status(400);
      throw new Error(
        "Doctor name, purpose, and appointment date/time are required fields."
      );
    }

    const appointment = await Appointment.create({
      user: req.user.id,
      ...req.body,
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Update an appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404);
      throw new Error("Appointment not found");
    }

    // Check if the appointment belongs to the logged-in user
    if (appointment.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("User not authorized");
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
      }
    );

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Delete an appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404);
      throw new Error("Appointment not found");
    }

    if (appointment.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("User not authorized");
    }

    await appointment.deleteOne();

    res.status(200).json({ id: req.params.id, message: "Appointment removed" });
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
