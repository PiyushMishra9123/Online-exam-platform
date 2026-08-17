const express = require("express");
const { registerUser, loginUser, getProfile , updateProfile , changePassword} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.get("/admin-test", protect, adminOnly, (req, res) => {
    res.json({
        message: "Welcome Admin! You have access to this route."
    });
});
module.exports = router;