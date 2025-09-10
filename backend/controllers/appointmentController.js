const Appointment = require('../models/appointmentModel');

// @desc    Get all appointments for a user
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ user: req.user.id }).sort({ appointmentDateTime: 1 }); // Sort by upcoming
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a new appointment
// @route   POST /api/appointments
// @access  Private
const addAppointment = async (req, res) => {
    try {
        const { doctorName, purpose, appointmentDateTime, specialty, location, notes } = req.body;

        if (!doctorName || !purpose || !appointmentDateTime) {
            res.status(400);
            throw new Error('Doctor name, purpose, and appointment date/time are required.');
        }

        const newAppointment = await Appointment.create({
            user: req.user.id,
            doctorName,
            purpose,
            appointmentDateTime,
            specialty,
            location,
            notes,
        });

        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Update an appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findOne({ _id: req.params.id, user: req.user.id });

        if (!appointment) {
            res.status(404);
            throw new Error('Appointment not found or user not authorized');
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
        const appointment = await Appointment.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        if (!appointment) {
            res.status(404);
            throw new Error('Appointment not found or user not authorized');
        }

        res.status(200).json({ id: req.params.id, message: 'Appointment removed' });
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

module.exports = {
    getAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
};