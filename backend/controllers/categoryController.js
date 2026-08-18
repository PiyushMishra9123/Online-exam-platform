const Category = require("../models/Category");

// Create Category
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const existingCategory = await Category.findOne({
      name: name.trim(),
    });

    if (existingCategory) {
      return res.status(409).json({
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description?.trim() || "",
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create Category Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get All Categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      categories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get Single Category
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      category,
    });
  } catch (error) {
    console.error("Get Category Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Update Category
const updateCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    if (name) {
      const existingCategory = await Category.findOne({
        name: name.trim(),
        _id: { $ne: req.params.id },
      });

      if (existingCategory) {
        return res.status(409).json({
          message: "Category name already exists",
        });
      }

      category.name = name.trim();
    }

    if (description !== undefined) {
      category.description = description.trim();
    }

    if (isActive !== undefined) {
      category.isActive = isActive;
    }

    const updatedCategory = await category.save();

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Update Category Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Delete Category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Soft delete
    category.isActive = false;

    await category.save();

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete Category Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};