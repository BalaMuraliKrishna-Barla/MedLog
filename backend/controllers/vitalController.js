const Vital = require("../models/vitalModel");

// @desc    Get all vitals for a user
// @route   GET /api/vitals
// @access  Private
const getVitals = async (req, res) => {
  try {
    const vitals = await Vital.find({ user: req.user.id }).sort({
      recordDate: -1,
    });
    res.status(200).json(vitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new vital record
// @route   POST /api/vitals
// @access  Private
const createVital = async (req, res) => {
  try {
    const vital = await Vital.create({
      user: req.user.id,
      ...req.body,
    });
    res.status(201).json(vital);
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Update a vital record
// @route   PUT /api/vitals/:id
// @access  Private
const updateVital = async (req, res) => {
  try {
    const vital = await Vital.findById(req.params.id);
    if (!vital || vital.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("Vital record not found or user not authorized");
    }
    const updatedVital = await Vital.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedVital);
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Delete a vital record
// @route   DELETE /api/vitals/:id
// @access  Private
const deleteVital = async (req, res) => {
  try {
    const vital = await Vital.findById(req.params.id);
    if (!vital || vital.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("Vital record not found or user not authorized");
    }
    await vital.deleteOne();
    res
      .status(200)
      .json({ id: req.params.id, message: "Vital record removed" });
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

module.exports = { getVitals, createVital, updateVital, deleteVital };
