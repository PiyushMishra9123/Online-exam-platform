const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    totalQuestions: {
      type: Number,
      default: 0,
    },

    totalMarks: {
      type: Number,
      default: 0,
    },

    negativeMarking: {
      type: Number,
      default: 0,
      min: 0,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard", "mixed"],
      default: "mixed",
    },

    examType: {
      type: String,
      enum: ["competitive", "company", "coding", "custom"],
      default: "competitive",
    },

    instructions: {
      type: [String],
      default: [],
    },


    questionBlueprint: {
  type: [
    {
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

      questionCount: {
        type: Number,
        required: true,
        min: 1,
      },

      difficulty: {
        type: String,
        enum: ["easy", "medium", "hard", "mixed"],
        default: "mixed",
      },
    },
  ],
  default: [],
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

module.exports = mongoose.model("Exam", examSchema);