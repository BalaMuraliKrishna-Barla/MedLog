const Medication = require("../models/medicationModel");

// @desc    Get all medications for a user
// @route   GET /api/medications
// @access  Private
const getMedications = async (req, res) => {
  try {
    const medications = await Medication.find({ user: req.user.id }).sort({
      startDate: -1,
    });
    res.status(200).json(medications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new medication record
// @route   POST /api/medications
// @access  Private
const createMedication = async (req, res) => {
  try {
    const { medicationName, dosage, frequency, startDate } = req.body;
    if (!medicationName || !dosage || !frequency || !startDate) {
      res.status(400);
      throw new Error(
        "Medication name, dosage, frequency, and start date are required."
      );
    }

    const medication = await Medication.create({
      user: req.user.id,
      ...req.body,
    });

    res.status(201).json(medication);
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Update a medication record
// @route   PUT /api/medications/:id
// @access  Private
const updateMedication = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);
    if (!medication || medication.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("Medication not found or user not authorized");
    }
    const updatedMedication = await Medication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedMedication);
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Delete a medication record
// @route   DELETE /api/medications/:id
// @access  Private
const deleteMedication = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);
    if (!medication || medication.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("Medication not found or user not authorized");
    }
    await medication.deleteOne();
    res
      .status(200)
      .json({ id: req.params.id, message: "Medication record removed" });
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  getMedications,
  createMedication,
  updateMedication,
  deleteMedication,
};
