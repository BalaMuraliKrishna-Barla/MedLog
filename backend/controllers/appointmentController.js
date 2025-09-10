const Appointment = require('../models/appointmentModel');
const AccessGrant = require('../models/accessGrantModel');


// @desc    Get all appointments for a user (either self or shared)
// @route   GET /api/appointments/user/:userId
// @access  Private
const getAppointments = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const requesterId = req.user.id;

        // Check if the requester is asking for their own records
        if (targetUserId === requesterId) {
            const appointments = await Appointment.find({ user: targetUserId }).sort({ appointmentDateTime: 1 });
            return res.status(200).json(appointments);
        }

        // If not, check if there is an active access grant
        const grant = await AccessGrant.findOne({
            owner: targetUserId,
            grantee: requesterId,
            status: 'active',
        });

        if (!grant) {
            res.status(403); // Use 403 Forbidden for valid user but no permission
            throw new Error('You do not have permission to access these records.');
        }

        // If grant exists and is active, fetch the records
        const appointments = await Appointment.find({ user: targetUserId }).sort({ appointmentDateTime: 1 });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
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
