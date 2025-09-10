const MedicalEvent = require("../models/medicalEventModel");

// @desc    Get all medical events for a user
// @route   GET /api/medicalevents
// @access  Private
const getMedicalEvents = async (req, res) => {
  try {
    const events = await MedicalEvent.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new medical event
// @route   POST /api/medicalevents
// @access  Private
const createMedicalEvent = async (req, res) => {
  try {
    const { eventType, title, date } = req.body;
    if (!eventType || !title || !date) {
      res.status(400);
      throw new Error("Event type, title, and date are required.");
    }

    const event = await MedicalEvent.create({
      user: req.user.id,
      ...req.body,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Update a medical event
// @route   PUT /api/medicalevents/:id
// @access  Private
const updateMedicalEvent = async (req, res) => {
  try {
    const event = await MedicalEvent.findById(req.params.id);
    if (!event || event.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("Event not found or user not authorized");
    }
    const updatedEvent = await MedicalEvent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Delete a medical event
// @route   DELETE /api/medicalevents/:id
// @access  Private
const deleteMedicalEvent = async (req, res) => {
  try {
    const event = await MedicalEvent.findById(req.params.id);
    if (!event || event.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("Event not found or user not authorized");
    }
    await event.deleteOne();
    res
      .status(200)
      .json({ id: req.params.id, message: "Medical event removed" });
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  getMedicalEvents,
  createMedicalEvent,
  updateMedicalEvent,
  deleteMedicalEvent,
};
