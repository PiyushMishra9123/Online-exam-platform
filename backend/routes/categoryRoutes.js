const express = require("express");

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Public - Users can view categories
router.get("/", getCategories);

router.get("/:id", getCategoryById);

// Admin only
router.post("/", protect, adminOnly, createCategory);

router.put("/:id", protect, adminOnly, updateCategory);

router.delete("/:id", protect, adminOnly, deleteCategory);

module.exports = router;