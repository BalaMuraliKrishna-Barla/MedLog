const AccessGrant = require("../models/accessGrantModel");
const User = require("../models/userModel");

// @desc    Grant access to another user
// @route   POST /api/access/grant
// @access  Private
const grantAccess = async (req, res) => {
  try {
    const { granteeEmail } = req.body;
    if (!granteeEmail) {
      res.status(400);
      throw new Error(
        "Please provide the email of the user to grant access to."
      );
    }

    const grantee = await User.findOne({ email: granteeEmail });
    if (!grantee) {
      res.status(404);
      throw new Error("No user found with that email address.");
    }

    // The user granting access is the logged-in user (the owner)
    const ownerId = req.user.id;

    if (ownerId === grantee.id) {
      res.status(400);
      throw new Error("You cannot grant access to yourself.");
    }

    // Check if a grant already exists
    const existingGrant = await AccessGrant.findOne({
      owner: ownerId,
      grantee: grantee.id,
    });
    if (existingGrant) {
      res.status(400);
      throw new Error(
        `Access has already been granted or is pending for this user. Status: ${existingGrant.status}`
      );
    }

    // Create a new pending grant
    const grant = await AccessGrant.create({
      owner: ownerId,
      grantee: grantee.id,
      status: "pending",
    });

    res.status(201).json(grant);
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Get pending access grants for the logged-in user
// @route   GET /api/access/pending
// @access  Private
const getPendingGrants = async (req, res) => {
  try {
    const pendingGrants = await AccessGrant.find({
      grantee: req.user.id,
      status: "pending",
    }).populate("owner", "name email"); // Show who sent the request

    res.status(200).json(pendingGrants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept a pending access grant
// @route   POST /api/access/accept/:grantId
// @access  Private
const acceptGrant = async (req, res) => {
  try {
    const grant = await AccessGrant.findById(req.params.grantId);

    // Security check: ensure grant exists and the logged-in user is the intended grantee
    if (!grant || grant.grantee.toString() !== req.user.id) {
      res.status(401);
      throw new Error(
        "Grant not found or you are not authorized to accept it."
      );
    }

    if (grant.status !== "pending") {
      res.status(400);
      throw new Error(
        `This grant is no longer pending. Current status: ${grant.status}`
      );
    }

    grant.status = "active";
    await grant.save();
    res.status(200).json(grant);
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Revoke an access grant (by the owner)
// @route   DELETE /api/access/revoke/:grantId
// @access  Private
const revokeAccess = async (req, res) => {
  try {
    const grant = await AccessGrant.findById(req.params.grantId);

    // Security check: ensure grant exists and the logged-in user is the owner
    if (!grant || grant.owner.toString() !== req.user.id) {
      res.status(401);
      throw new Error(
        "Grant not found or you are not authorized to revoke it."
      );
    }

    await grant.deleteOne();
    res
      .status(200)
      .json({
        id: req.params.grantId,
        message: "Access has been successfully revoked.",
      });
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Get a list of users the current user has granted access to
// @route   GET /api/access/granted
// @access  Private
const getGrantedAccessList = async (req, res) => {
  try {
    const grants = await AccessGrant.find({ owner: req.user.id }).populate(
      "grantee",
      "name email"
    ); // Show details of who has access
    res.status(200).json(grants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a list of patients who have granted access to the logged-in user (for doctors)
// @route   GET /api/access/patients
// @access  Private
const getPatientList = async (req, res) => {
  try {
    const patients = await AccessGrant.find({
      grantee: req.user.id,
      status: "active",
    }).populate("owner", "name email dateOfBirth"); // Show details of patients
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  grantAccess,
  getPendingGrants,
  acceptGrant,
  revokeAccess,
  getGrantedAccessList,
  getPatientList,
};
