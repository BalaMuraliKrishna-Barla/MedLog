const Allergy = require("../models/allergyModel");

// @desc    Get all allergies for a user
// @route   GET /api/allergies
// @access  Private
const getAllergies = async (req, res) => {
  try {
    const allergies = await Allergy.find({ user: req.user.id });
    res.status(200).json(allergies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new allergy record
// @route   POST /api/allergies
// @access  Private
const createAllergy = async (req, res) => {
  try {
    const { allergen, reaction, severity, notes } = req.body;
    if (!allergen || !reaction || !severity) {
      res.status(400);
      throw new Error("Allergen, reaction, and severity are required fields.");
    }

    const allergy = await Allergy.create({
      user: req.user.id,
      allergen,
      reaction,
      severity,
      notes,
    });

    res.status(201).json(allergy);
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Update an allergy record
// @route   PUT /api/allergies/:id
// @access  Private
const updateAllergy = async (req, res) => {
  try {
    const allergy = await Allergy.findById(req.params.id);

    if (!allergy) {
      res.status(404);
      throw new Error("Allergy record not found");
    }

    // Check if the record belongs to the user
    if (allergy.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("User not authorized");
    }

    const updatedAllergy = await Allergy.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the modified document
      }
    );

    res.status(200).json(updatedAllergy);
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Delete an allergy record
// @route   DELETE /api/allergies/:id
// @access  Private
const deleteAllergy = async (req, res) => {
  try {
    const allergy = await Allergy.findById(req.params.id);

    if (!allergy) {
      res.status(404);
      throw new Error("Allergy record not found");
    }

    if (allergy.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("User not authorized");
    }

    await allergy.deleteOne();

    res
      .status(200)
      .json({ id: req.params.id, message: "Allergy record removed" });
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  getAllergies,
  createAllergy,
  updateAllergy,
  deleteAllergy,
};
