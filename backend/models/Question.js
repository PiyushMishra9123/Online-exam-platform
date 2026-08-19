const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    questionText: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [
        {
          text: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],
      validate: {
        validator: function (options) {
          return options.length >= 2;
        },
        message: "At least 2 options are required",
      },
    },

    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
    },

    explanation: {
      type: String,
      default: "",
      trim: true,
    },

    marks: {
      type: Number,
      default: 1,
      min: 0,
    },

    negativeMarks: {
      type: Number,
      default: 0,
      min: 0,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    topic: {
      type: String,
      default: "",
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    questionType: {
      type: String,
      enum: ["mcq", "multiple_correct", "true_false"],
      default: "mcq",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);