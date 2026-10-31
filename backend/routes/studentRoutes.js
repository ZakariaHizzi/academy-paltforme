const express = require('express');
const bcrypt = require('bcrypt');
const Student = require('../models/Student');
const User = require('../models/User');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, authorizeRoles('director'), async (req, res) => {
  try {
    const students = await Student.find().populate('user', 'email role');
    return res.json(students);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id }).populate('user', 'email role');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.json(student);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', verifyToken, authorizeRoles('director'), async (req, res) => {
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
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'student',
    });

    const student = await Student.create({
      user: user._id,
      name,
      studentId,
      major,
      gpa,
      creditsCompleted,
      campusCardBalance,
    });

    return res.status(201).json({ user: { id: user._id, email: user.email, role: user.role }, student });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
