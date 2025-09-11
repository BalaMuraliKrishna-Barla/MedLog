const express = require("express");
const router = express.Router();
const {
  sendRegistrationOtp,
  verifyOtpAndRegisterUser,
  loginUser,
  getMe,
  getUserById,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware"); // Import the middleware

router.post("/send-otp", sendRegistrationOtp);
router.post("/verify-register", verifyOtpAndRegisterUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe); // Add the new protected route
router.get("/:id", protect, getUserById); // Add new route for getting user by ID

module.exports = router;
