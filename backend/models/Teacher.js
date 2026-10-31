const mongoose = require('mongoose');
const User = require('./User');

const teacherSchema = new mongoose.Schema({
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
});

const Teacher = User.discriminator('Teacher', teacherSchema);

module.exports = Teacher;
