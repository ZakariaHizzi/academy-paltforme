const express = require('express');
const bcrypt = require('bcrypt');
const Teacher = require('../models/Teacher');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, authorizeRoles('director'), async (req, res) => {
  try {
    const teachers = await Teacher.find();
    return res.json(teachers);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id).select('-password');

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

    const teacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      department,
      rank,
      office,
      teachingLoad,
    });

    const createdTeacher = await teacher.save();

    return res.status(201).json(createdTeacher);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
