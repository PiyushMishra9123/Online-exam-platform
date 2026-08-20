const express = require("express");

const {
  createQuestion,
  getQuestionsByExam,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  createMultipleQuestions,
} = require("../controllers/questionController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Get questions for an exam
router.get(
  "/exam/:examId",
  protect,
  getQuestionsByExam
);

// Get single question
router.get(
  "/:id",
  protect,
  getQuestionById
);

// Admin create question
router.post(
  "/",
  protect,
  adminOnly,
  createQuestion
);

router.post(
  "/bulk",
  protect,
  adminOnly,
  createMultipleQuestions
);

// Admin update question
router.put(
  "/:id",
  protect,
  adminOnly,
  updateQuestion
);

// Admin can delete question
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteQuestion
);

module.exports = router;