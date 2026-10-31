const mongoose = require('mongoose');
const User = require('./User');

const studentSchema = new mongoose.Schema({
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
});

const Student = User.discriminator('Student', studentSchema);

module.exports = Student;
