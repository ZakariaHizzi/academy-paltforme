const express = require('express');
const { login } = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);

router.post('/logout', (req, res) => {
  return res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
