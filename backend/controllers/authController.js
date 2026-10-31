const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

router.use(verifyToken, authorizeRoles('director'));

router.post('/students', async (req, res) => {
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

router.post('/teachers', async (req, res) => {
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
module.exports.login = login;
