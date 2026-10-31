const express = require('express');
const bcrypt = require('bcrypt');
const Student = require('../models/Student');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, authorizeRoles('director'), async (req, res) => {
  try {
    const students = await Student.find();
    return res.json(students);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');

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

    const student = new Student({
      name,
      email,
      password: hashedPassword,
      studentId,
      major,
      gpa,
      creditsCompleted,
      campusCardBalance,
    });

    const createdStudent = await student.save();

    return res.status(201).json(createdStudent);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
