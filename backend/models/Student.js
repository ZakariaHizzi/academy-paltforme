const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    gpa: {
      type: Number,
      default: 0,
      min: 0,
      max: 4,
    },
    creditsCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },
    campusCardBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    major: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'students',
  }
);

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
