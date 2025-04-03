const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  createAdmin
} = require('../controllers/authController');

// Public routes
router.post('/login', authUser);
router.post('/register', registerUser);

// Protected admin route
router.post('/create-admin', createAdmin); // Add admin middleware here if needed

module.exports = router;