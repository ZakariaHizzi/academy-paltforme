const express = require('express');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const {
  listTeachers,
  getTeacherProfile,
  getTeacherRoster,
  createTeacher,
  updateTeacherStudents,
} = require('../controllers/facultyController');

const router = express.Router();

router.get('/', verifyToken, authorizeRoles('director'), listTeachers);

router.get('/profile', verifyToken, authorizeRoles('faculty'), getTeacherProfile);

router.get('/:id/students', verifyToken, authorizeRoles('director', 'faculty'), getTeacherRoster);

router.post('/', verifyToken, authorizeRoles('director'), createTeacher);

router.put('/:id/students', verifyToken, authorizeRoles('director'), updateTeacherStudents);

module.exports = router;
