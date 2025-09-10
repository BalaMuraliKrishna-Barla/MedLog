const express = require("express");
const router = express.Router();
const {
  grantAccess,
  getPendingGrants,
  acceptGrant,
  revokeAccess,
  getGrantedAccessList,
  getPatientList,
} = require("../controllers/accessController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

// Patient routes
router.post("/grant", grantAccess);
router.delete("/revoke/:grantId", revokeAccess);
router.get("/granted", getGrantedAccessList);

// Doctor/Guardian routes
router.get("/pending", getPendingGrants);
router.post("/accept/:grantId", acceptGrant);
router.get("/patients", getPatientList);

module.exports = router;
