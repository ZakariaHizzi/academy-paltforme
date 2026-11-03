const express = require('express');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const {
  listStudents,
  getStudentProfile,
  getStudentById,
  createStudent,
  updateStudent,
} = require('../controllers/studentController');

const router = express.Router();

router.get('/', verifyToken, authorizeRoles('director'), listStudents);

router.get('/profile', verifyToken, authorizeRoles('student'), getStudentProfile);

router.get('/:id', verifyToken, authorizeRoles('director', 'faculty'), getStudentById);

router.post('/', verifyToken, authorizeRoles('director'), createStudent);

router.patch('/:id', verifyToken, authorizeRoles('director', 'faculty'), updateStudent);

module.exports = router;
