const Question = require("../models/Question");
const Exam = require("../models/Exam");

// Create Question
const createQuestion = async (req, res) => {
  try {
    const {
      exam,
      questionText,
      options,
      correctAnswer,
      explanation,
      marks,
      negativeMarks,
      subject,
      topic,
      difficulty,
      questionType,
    } = req.body;

    // Required fields
    if (
      !exam ||
      !questionText ||
      !options ||
      correctAnswer === undefined ||
      !subject
    ) {
      return res.status(400).json({
        message:
          "Exam, question, options, correct answer and subject are required",
      });
    }

    // Check exam
    const existingExam = await Exam.findOne({
      _id: exam,
      isActive: true,
    });

    if (!existingExam) {
      return res.status(404).json({
        message: "Exam not found or inactive",
      });
    }

    // Check options
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        message: "At least 2 options are required",
      });
    }

    // Check correct answer index
    if (
      correctAnswer < 0 ||
      correctAnswer >= options.length
    ) {
      return res.status(400).json({
        message: "Invalid correct answer index",
      });
    }

    // Create question
    const question = await Question.create({
      exam,
      questionText: questionText.trim(),
      options,
      correctAnswer,
      explanation: explanation?.trim() || "",
      marks: marks ?? 1,
      negativeMarks: negativeMarks ?? existingExam.negativeMarking,
      subject: subject.trim(),
      topic: topic?.trim() || "",
      difficulty: difficulty || "medium",
      questionType: questionType || "mcq",
    });

    // Increase total questions
    existingExam.totalQuestions += 1;

    // If marks were not manually specified,
    // update total marks automatically
    existingExam.totalMarks += marks ?? 1;

    await existingExam.save();

    const populatedQuestion = await question.populate(
      "exam",
      "title category"
    );

    res.status(201).json({
      message: "Question created successfully",
      question: populatedQuestion,
    });
  } catch (error) {
    console.error("Create Question Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get Questions by Exam
const getQuestionsByExam = async (req, res) => {
  try {
    const questions = await Question.find({
      exam: req.params.examId,
      isActive: true,
    })
      .select("-correctAnswer -explanation")
      .sort({ createdAt: 1 });

    res.status(200).json({
      questions,
    });
  } catch (error) {
    console.error(
      "Get Questions Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get Single Question
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findOne({
      _id: req.params.id,
      isActive: true,
    })
      .populate("exam", "title category")
      .select("-correctAnswer -explanation");

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    res.status(200).json({
      question,
    });
  } catch (error) {
    console.error(
      "Get Question Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Update Question
const updateQuestion = async (req, res) => {
  try {
    const {
      questionText,
      options,
      correctAnswer,
      explanation,
      marks,
      negativeMarks,
      subject,
      topic,
      difficulty,
      questionType,
      isActive,
    } = req.body;

    const question = await Question.findById(
      req.params.id
    );

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    // Validate options if provided
    if (options !== undefined) {
      if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({
          message: "At least 2 options are required",
        });
      }

      question.options = options;
    }

    // Validate correct answer if provided
    if (correctAnswer !== undefined) {
      const currentOptions =
        options !== undefined
          ? options
          : question.options;

      if (
        correctAnswer < 0 ||
        correctAnswer >= currentOptions.length
      ) {
        return res.status(400).json({
          message: "Invalid correct answer index",
        });
      }

      question.correctAnswer = correctAnswer;
    }

    if (questionText !== undefined) {
      question.questionText = questionText.trim();
    }

    if (explanation !== undefined) {
      question.explanation = explanation.trim();
    }

    if (marks !== undefined) {
      question.marks = marks;
    }

    if (negativeMarks !== undefined) {
      question.negativeMarks = negativeMarks;
    }

    if (subject !== undefined) {
      question.subject = subject.trim();
    }

    if (topic !== undefined) {
      question.topic = topic.trim();
    }

    if (difficulty !== undefined) {
      question.difficulty = difficulty;
    }

    if (questionType !== undefined) {
      question.questionType = questionType;
    }

    if (isActive !== undefined) {
      question.isActive = isActive;
    }

    const updatedQuestion = await question.save();

    res.status(200).json({
      message: "Question updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error(
      "Update Question Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Delete Question
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    // Already deleted check
    if (!question.isActive) {
      return res.status(400).json({
        message: "Question is already deleted",
      });
    }

    // Find associated exam
    const exam = await Exam.findById(question.exam);

    if (!exam) {
      return res.status(404).json({
        message: "Associated exam not found",
      });
    }

    // Soft delete question
    question.isActive = false;

    await question.save();

    // Decrease question count
    exam.totalQuestions = Math.max(
      0,
      exam.totalQuestions - 1
    );

    // Decrease total marks
    exam.totalMarks = Math.max(
      0,
      exam.totalMarks - question.marks
    );

    await exam.save();

    res.status(200).json({
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Question Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createQuestion,
  getQuestionsByExam,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};