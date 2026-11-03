const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { DEFAULT_CLASS_BLOCK_PROPS } = require('../config/defaultClassBlockProps');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const User = require('../models/User');

const CLASS_BLOCK_FIELDS = [
  'code',
  'title',
  'room',
  'instructor',
  'badge',
  'blockClass',
  'codeClass',
  'badgeClass',
  'detailClass',
  'day',
  'startTime',
  'endTime',
];

const httpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const normalizeClassBlockProps = (value) => {
  if (value === undefined) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw httpError(400, 'classBlockProps must be an array of class blocks');
  }

  return value.map((block, index) => {
    if (!block || typeof block !== 'object' || Array.isArray(block)) {
      throw httpError(400, `classBlockProps[${index}] must be an object`);
    }

    const normalized = {};

    for (const field of CLASS_BLOCK_FIELDS) {
      const rawValue = block[field];

      if (rawValue === undefined || rawValue === null) {
        continue;
      }

      if (typeof rawValue !== 'string') {
        throw httpError(400, `classBlockProps[${index}].${field} must be a string`);
      }

      normalized[field] = rawValue.trim();
    }

    if (!normalized.code || !normalized.title) {
      throw httpError(400, `classBlockProps[${index}] requires "code" and "title"`);
    }

    return normalized;
  });
};

const normalizeRoster = (value) => {
  if (value === undefined) {
    return undefined;
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw httpError(400, 'roster must be an object');
  }

  const normalized = {};
  const stringFields = ['track', 'letterGrade', 'attendanceSummary', 'dossierLabel'];
  const numberFields = ['year', 'midtermScore', 'labsScore', 'examBonus'];

  for (const field of stringFields) {
    if (value[field] !== undefined) {
      normalized[field] = String(value[field]).trim();
    }
  }

  for (const field of numberFields) {
    if (value[field] !== undefined) {
      const numeric = Number(value[field]);

      if (Number.isNaN(numeric)) {
        throw httpError(400, `roster.${field} must be a number`);
      }

      normalized[field] = numeric;
    }
  }

  if (value.attendanceStatus !== undefined) {
    normalized.attendanceStatus = String(value.attendanceStatus).trim();
  }

  if (value.dossierStatus !== undefined) {
    normalized.dossierStatus = String(value.dossierStatus).trim();
  }

  if (value.academicAlert !== undefined) {
    normalized.academicAlert = Boolean(value.academicAlert);
  }

  return normalized;
};

const sendError = (res, error) => {
  if (error.status) {
    return res.status(error.status).json({ message: error.message });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.values(error.errors).map((validationError) => validationError.message),
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ message: `Invalid value for ${error.path}` });
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || 'field';
    return res.status(409).json({ message: `A record with this ${field} already exists` });
  }

  return res.status(500).json({ message: 'Server error', error: error.message });
};

const listStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('user', 'email role');
    return res.json(students);
  } catch (error) {
    return sendError(res, error);
  }
};

const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id }).populate('user', 'email role');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.json(student);
  } catch (error) {
    return sendError(res, error);
  }
};

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    let query;

    if (mongoose.isValidObjectId(id)) {
      query = { $or: [{ _id: id }, { studentId: id }] };
    } else {
      query = { studentId: id };
    }

    const student = await Student.findOne(query).populate('user', 'email role');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.json(student);
  } catch (error) {
    return sendError(res, error);
  }
};

const createStudent = async (req, res) => {
  let user;

  try {
    const {
      name,
      email,
      password,
      studentId,
      major,
      gpa,
      creditsCompleted,
      campusCardBalance,
      classBlockProps,
      roster,
    } = req.body;

    if (!name || !email || !password || !studentId || !major) {
      return res.status(400).json({
        message: 'Missing required fields: name, email, password, studentId, and major are required',
      });
    }

    const normalizedClassBlockProps = normalizeClassBlockProps(classBlockProps);
    const normalizedRoster = normalizeRoster(roster);
    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedStudentId = String(studentId).trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists' });
    }

    const existingStudent = await Student.findOne({ studentId: normalizedStudentId });
    if (existingStudent) {
      return res.status(409).json({ message: 'A student with this studentId already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      role: 'student',
    });

    const student = await Student.create({
      user: user._id,
      name: String(name).trim(),
      studentId: normalizedStudentId,
      major: String(major).trim(),
      gpa: Number(gpa) || 0,
      creditsCompleted: Number(creditsCompleted) || 0,
      campusCardBalance: Number(campusCardBalance) || 0,
      classBlockProps:
        normalizedClassBlockProps && normalizedClassBlockProps.length > 0
          ? normalizedClassBlockProps
          : DEFAULT_CLASS_BLOCK_PROPS,
      ...(normalizedRoster !== undefined ? { roster: normalizedRoster } : {}),
    });

    // Every teacher's roster shows all students, so a newly enrolled student
    // appears on the faculty pages immediately.
    await Teacher.updateMany({}, { $addToSet: { students: student._id } });

    return res.status(201).json({
      user: { id: user._id, email: user.email, role: user.role },
      student,
    });
  } catch (error) {
    if (user) {
      const studentExists = await Student.exists({ user: user._id }).catch(() => true);

      if (!studentExists) {
        await User.deleteOne({ _id: user._id }).catch(() => {});
      }
    }

    return sendError(res, error);
  }
};

const updateStudent = async (req, res) => {
  try {
    const {
      name,
      major,
      gpa,
      creditsCompleted,
      campusCardBalance,
      classBlockProps,
      roster,
    } = req.body;

    const updates = {};

    if (name !== undefined) {
      updates.name = String(name).trim();
    }

    if (major !== undefined) {
      updates.major = String(major).trim();
    }

    if (gpa !== undefined) {
      updates.gpa = Number(gpa);
    }

    if (creditsCompleted !== undefined) {
      updates.creditsCompleted = Number(creditsCompleted);
    }

    if (campusCardBalance !== undefined) {
      updates.campusCardBalance = Number(campusCardBalance);
    }

    const normalizedClassBlockProps = normalizeClassBlockProps(classBlockProps);
    if (normalizedClassBlockProps !== undefined) {
      updates.classBlockProps = normalizedClassBlockProps;
    }

    const normalizedRoster = normalizeRoster(roster);
    if (normalizedRoster !== undefined) {
      updates.roster = normalizedRoster;
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('user', 'email role');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.json(student);
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  listStudents,
  getStudentProfile,
  getStudentById,
  createStudent,
  updateStudent,
};
