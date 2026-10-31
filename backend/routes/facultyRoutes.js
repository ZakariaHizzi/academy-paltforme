const express = require('express');
const bcrypt = require('bcrypt');
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, authorizeRoles('director'), async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('user', 'email role');
    return res.json(teachers);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/profile', verifyToken, authorizeRoles('faculty'), async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user.id }).populate('user', 'email role');

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    return res.json(teacher);
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
      department,
      rank,
      office,
      teachingLoad,
    } = req.body;

    if (!name || !email || !password || !department || !rank) {
      return res.status(400).json({
        message: 'Missing required fields: name, email, password, department, and rank are required',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      role: 'faculty',
    });

    const teacher = await Teacher.create({
      user: user._id,
      name,
      department,
      rank,
      office: office || '',
      teachingLoad: Number(teachingLoad) || 0,
    });

    return res.status(201).json({
      user: { id: user._id, email: user.email, role: user.role },
      teacher,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
