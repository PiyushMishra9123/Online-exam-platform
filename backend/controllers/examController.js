const Exam = require("../models/Exam");
const Category = require("../models/Category");
const Question = require("../models/Question");

// Create Exam
const createExam = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      duration,
      totalMarks,
      negativeMarking,
      difficulty,
      examType,
      instructions,
    } = req.body;

    if (!title || !category || !duration) {
      return res.status(400).json({
        message: "Title, category and duration are required",
      });
    }

    // Check category exists
    const existingCategory = await Category.findOne({
      _id: category,
      isActive: true,
    });

    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found or inactive",
      });
    }

    const exam = await Exam.create({
      title: title.trim(),
      description: description?.trim() || "",
      category,
      duration,
      totalMarks: totalMarks || 0,
      negativeMarking: negativeMarking || 0,
      difficulty: difficulty || "mixed",
      examType: examType || "competitive",
      instructions: instructions || [],
    });

    const populatedExam = await exam.populate("category", "name description");

    res.status(201).json({
      message: "Exam created successfully",
      exam: populatedExam,
    });
  } catch (error) {
    console.error("Create Exam Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get All Exams
const getExams = async (req, res) => {
  try {
    const exams = await Exam.find({
      isActive: true,
    })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      exams,
    });
  } catch (error) {
    console.error("Get Exams Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get Single Exam
const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate("category", "name description");

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    res.status(200).json({
      exam,
    });
  } catch (error) {
    console.error("Get Exam Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Update Exam
const updateExam = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      duration,
      totalMarks,
      negativeMarking,
      difficulty,
      examType,
      instructions,
      questionBlueprint,
      isActive,
    } = req.body;

    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    // If category is being changed
    if (category) {
      const existingCategory = await Category.findOne({
        _id: category,
        isActive: true,
      });

      if (!existingCategory) {
        return res.status(404).json({
          message: "Category not found or inactive",
        });
      }

      exam.category = category;
    }

    if (title !== undefined) {
      exam.title = title.trim();
    }

    if (description !== undefined) {
      exam.description = description.trim();
    }

    if (duration !== undefined) {
      exam.duration = duration;
    }

    if (totalMarks !== undefined) {
      exam.totalMarks = totalMarks;
    }

    if (negativeMarking !== undefined) {
      exam.negativeMarking = negativeMarking;
    }

    if (difficulty !== undefined) {
      exam.difficulty = difficulty;
    }

    if (examType !== undefined) {
      exam.examType = examType;
    }

    if (instructions !== undefined) {
      exam.instructions = instructions;
    }

    if (questionBlueprint !== undefined) {
      if (!Array.isArray(questionBlueprint)) {
        return res.status(400).json({
          message: "questionBlueprint must be an array",
        });
      }

      exam.questionBlueprint = questionBlueprint;
    }

    if (isActive !== undefined) {
      exam.isActive = isActive;
    }

    const updatedExam = await exam.save();

    const populatedExam = await updatedExam.populate(
      "category",
      "name description",
    );

    res.status(200).json({
      message: "Exam updated successfully",
      exam: populatedExam,
    });
  } catch (error) {
    console.error("Update Exam Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Delete Exam
const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    // Soft delete
    exam.isActive = false;

    await exam.save();

    res.status(200).json({
      message: "Exam deleted successfully",
    });
  } catch (error) {
    console.error("Delete Exam Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Generate Exam Paper from Question Blueprint
const generateExamPaper = async (req, res) => {
  try {
    const exam = await Exam.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found or inactive",
      });
    }

    const blueprint = exam.questionBlueprint || [];

    // Check blueprint
    if (blueprint.length === 0) {
      return res.status(400).json({
        message: "Exam question blueprint is empty",
      });
    }

    // Validate blueprint
    for (const item of blueprint) {
      if (!item.subject || !item.questionCount || item.questionCount < 1) {
        return res.status(400).json({
          message: "Invalid question blueprint",
        });
      }
    }

    // Calculate total required questions
    const requiredQuestions = blueprint.reduce(
      (total, item) => total + item.questionCount,
      0,
    );

    // Check each blueprint section
    const generatedQuestions = [];

    for (const item of blueprint) {
      const filter = {
        exam: exam._id,
        subject: item.subject,
        isActive: true,
      };

      // Topic filter
      if (item.topic && item.topic.trim() !== "") {
        filter.topic = item.topic;
      }

      // Difficulty filter
      if (item.difficulty && item.difficulty !== "mixed") {
        filter.difficulty = item.difficulty;
      }

      // Count available questions
      const availableCount = await Question.countDocuments(filter);

      // Not enough questions
      if (availableCount < item.questionCount) {
        return res.status(400).json({
          message: "Not enough questions available",
          subject: item.subject,
          required: item.questionCount,
          available: availableCount,
        });
      }

      // Randomly select questions
      const selectedQuestions = await Question.aggregate([
        {
          $match: filter,
        },
        {
          $sample: {
            size: item.questionCount,
          },
        },
        {
          $project: {
            correctAnswer: 0,
            explanation: 0,
          },
        },
      ]);

      generatedQuestions.push(...selectedQuestions);
    }

    res.status(200).json({
      message: "Exam paper generated successfully",
      examId: exam._id,
      examTitle: exam.title,
      totalQuestions: generatedQuestions.length,
      requiredQuestions,
      questions: generatedQuestions,
    });
  } catch (error) {
    console.error("Generate Exam Paper Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
  generateExamPaper,
};
