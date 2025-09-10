const Vaccination = require("../models/vaccinationModel");

// @desc    Get all vaccinations for a user
// @route   GET /api/vaccinations
// @access  Private
const getVaccinations = async (req, res) => {
  try {
    const vaccinations = await Vaccination.find({ user: req.user.id }).sort({
      dateAdministered: -1,
    });
    res.status(200).json(vaccinations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new vaccination record
// @route   POST /api/vaccinations
// @access  Private
const createVaccination = async (req, res) => {
  try {
    const { vaccineName, dateAdministered, administeredBy } = req.body;
    if (!vaccineName || !dateAdministered || !administeredBy) {
      res.status(400);
      throw new Error("Vaccine name, date, and administrator are required.");
    }

    const vaccination = await Vaccination.create({
      user: req.user.id,
      ...req.body,
    });

    res.status(201).json(vaccination);
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Update a vaccination record
// @route   PUT /api/vaccinations/:id
// @access  Private
const updateVaccination = async (req, res) => {
  try {
    const vaccination = await Vaccination.findById(req.params.id);
    if (!vaccination || vaccination.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("Vaccination not found or user not authorized");
    }
    const updatedVaccination = await Vaccination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedVaccination);
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Delete a vaccination record
// @route   DELETE /api/vaccinations/:id
// @access  Private
const deleteVaccination = async (req, res) => {
  try {
    const vaccination = await Vaccination.findById(req.params.id);
    if (!vaccination || vaccination.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("Vaccination not found or user not authorized");
    }
    await vaccination.deleteOne();
    res
      .status(200)
      .json({ id: req.params.id, message: "Vaccination record removed" });
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  getVaccinations,
  createVaccination,
  updateVaccination,
  deleteVaccination,
};
