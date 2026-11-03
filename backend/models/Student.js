const mongoose = require('mongoose');

const classBlockPropsSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    room: {
      type: String,
      trim: true,
      default: '',
    },
    instructor: {
      type: String,
      trim: true,
      default: '',
    },
    badge: {
      type: String,
      trim: true,
      default: 'Lecture',
    },
    blockClass: {
      type: String,
      trim: true,
      default: '',
    },
    codeClass: {
      type: String,
      trim: true,
      default: '',
    },
    badgeClass: {
      type: String,
      trim: true,
      default: '',
    },
    detailClass: {
      type: String,
      trim: true,
      default: '',
    },
    day: {
      type: String,
      trim: true,
      default: '',
    },
    startTime: {
      type: String,
      trim: true,
      match: [/^$|^([01]\d|2[0-3]):[0-5]\d$/, 'startTime must use 24-hour HH:MM format'],
    },
    endTime: {
      type: String,
      trim: true,
      match: [/^$|^([01]\d|2[0-3]):[0-5]\d$/, 'endTime must use 24-hour HH:MM format'],
    },
  },
  {
    _id: true,
  }
);

const rosterSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      min: 1,
      max: 8,
      default: 1,
    },
    track: {
      type: String,
      trim: true,
      default: '',
    },
    midtermScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    labsScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    letterGrade: {
      type: String,
      trim: true,
      default: '',
    },
    attendanceSummary: {
      type: String,
      trim: true,
      default: '',
    },
    attendanceStatus: {
      type: String,
      enum: ['present', 'absent', 'late', 'excused', 'idle'],
      default: 'idle',
    },
    dossierStatus: {
      type: String,
      enum: ['verified', 'submitted', 'in-review', 'incomplete', 'honors', 'none'],
      default: 'none',
    },
    dossierLabel: {
      type: String,
      trim: true,
      default: '',
    },
    academicAlert: {
      type: Boolean,
      default: false,
    },
    examBonus: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

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
    classBlockProps: {
      type: [classBlockPropsSchema],
      default: [],
    },
    roster: {
      type: rosterSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    collection: 'students',
  }
);

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
