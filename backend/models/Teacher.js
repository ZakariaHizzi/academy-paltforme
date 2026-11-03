const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
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
    department: {
      type: String,
      required: true,
      trim: true,
    },
    rank: {
      type: String,
      enum: ['Lecturer', 'Assistant Professor', 'Associate Professor', 'Professor'],
      default: 'Lecturer',
    },
    office: {
      type: String,
      trim: true,
    },
    teachingLoad: {
      type: Number,
      default: 0,
      min: 0,
    },
    students: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student',
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'teachers',
  }
);

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
