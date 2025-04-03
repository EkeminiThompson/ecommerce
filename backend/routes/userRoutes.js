const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

// Make sure all these routes are properly defined
router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

// This is the critical line that must be present
module.exports = router;