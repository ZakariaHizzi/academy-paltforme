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

router.get('/profile', verifyToken, async (req, res) => {
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'faculty',
    });

    const teacher = await Teacher.create({
      user: user._id,
      name,
      department,
      rank,
      office,
      teachingLoad,
    });

    return res.status(201).json({ user: { id: user._id, email: user.email, role: user.role }, teacher });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
