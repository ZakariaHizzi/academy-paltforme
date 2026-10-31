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
      enum: ['Lecturer', 'Assistant Professor', 'Associate Professor', 'Professor', 'Tenured Chair'],
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
  },
  {
    timestamps: true,
    collection: 'teachers',
  }
);

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
