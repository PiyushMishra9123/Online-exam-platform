const express = require("express");

const {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
} = require("../controllers/examController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Public - users can view exams
router.get("/", getExams);

router.get("/:id", getExamById);

// Admin only
router.post("/", protect, adminOnly, createExam);

router.put("/:id", protect, adminOnly, updateExam);

router.delete("/:id", protect, adminOnly, deleteExam);

module.exports = router;