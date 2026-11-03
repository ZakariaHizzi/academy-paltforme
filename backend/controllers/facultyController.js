const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const User = require('../models/User');

const httpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
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

/**
 * Loads the teacher's account and the full student roster stored on the
 * teacher document, including each student's linked user account.
 */
const populateTeacher = (query) =>
  query.populate('user', 'email role').populate({
    path: 'students',
    populate: { path: 'user', select: 'email role' },
  });

const normalizeStudentIds = (value) => {
  if (value === undefined) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw httpError(400, 'students must be an array of Student ObjectIds');
  }

  const ids = [...new Set(value.map((id) => String(id).trim()))];

  const invalidId = ids.find((id) => !mongoose.isValidObjectId(id));
  if (invalidId) {
    throw httpError(400, `Invalid Student ObjectId: ${invalidId}`);
  }

  return ids;
};

const assertStudentsExist = async (studentIds) => {
  if (!studentIds || studentIds.length === 0) {
    return;
  }

  const foundCount = await Student.countDocuments({ _id: { $in: studentIds } });

  if (foundCount !== studentIds.length) {
    throw httpError(400, 'One or more students in the roster do not exist');
  }
};

const listTeachers = async (req, res) => {
  try {
    const teachers = await populateTeacher(Teacher.find());
    return res.json(teachers);
  } catch (error) {
    return sendError(res, error);
  }
};

const getTeacherProfile = async (req, res) => {
  try {
    const teacher = await populateTeacher(Teacher.findOne({ user: req.user.id }));

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    return res.json(teacher);
  } catch (error) {
    return sendError(res, error);
  }
};

const getTeacherRoster = async (req, res) => {
  try {
    const teacher = await populateTeacher(
      Teacher.findById(req.params.id).select('name department students')
    );

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    return res.json({
      teacherId: teacher._id,
      name: teacher.name,
      department: teacher.department,
      students: teacher.students,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const createTeacher = async (req, res) => {
  let user;

  try {
    const {
      name,
      email,
      password,
      department,
      rank,
      office,
      teachingLoad,
      students,
    } = req.body;

    if (!name || !email || !password || !department || !rank) {
      return res.status(400).json({
        message: 'Missing required fields: name, email, password, department, and rank are required',
      });
    }

    let normalizedStudents = normalizeStudentIds(students);

    // A new teacher starts with the full student roster so her faculty page
    // shows the same students as every other teacher page.
    if (normalizedStudents === undefined) {
      normalizedStudents = await Student.find({}, '_id').then((records) =>
        records.map((record) => record._id)
      );
    }

    await assertStudentsExist(normalizedStudents);

    const normalizedEmail = String(email).trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      role: 'faculty',
    });

    const teacher = await Teacher.create({
      user: user._id,
      name: String(name).trim(),
      department: String(department).trim(),
      rank,
      office: office || '',
      teachingLoad: Number(teachingLoad) || 0,
      ...(normalizedStudents !== undefined ? { students: normalizedStudents } : {}),
    });

    return res.status(201).json({
      user: { id: user._id, email: user.email, role: user.role },
      teacher,
    });
  } catch (error) {
    if (user) {
      const teacherExists = await Teacher.exists({ user: user._id }).catch(() => true);

      if (!teacherExists) {
        await User.deleteOne({ _id: user._id }).catch(() => {});
      }
    }

    return sendError(res, error);
  }
};

const updateTeacherStudents = async (req, res) => {
  try {
    const studentIds = normalizeStudentIds(req.body.students ?? req.body.studentIds);

    if (studentIds === undefined) {
      return res.status(400).json({
        message: 'students must be provided as an array of Student ObjectIds',
      });
    }

    await assertStudentsExist(studentIds);

    const teacher = await populateTeacher(
      Teacher.findByIdAndUpdate(
        req.params.id,
        { $set: { students: studentIds } },
        { new: true, runValidators: true }
      )
    );

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    return res.json(teacher);
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  listTeachers,
  getTeacherProfile,
  getTeacherRoster,
  createTeacher,
  updateTeacherStudents,
};
