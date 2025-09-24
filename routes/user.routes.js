const express = require('express');
const router = express.Router();
const {registerUser, getUserProfile} = require('../controllers/user.controller');

const authMiddleware = require('../middlewares/auth.middleware');

// Public Routes
router.post('/register',registerUser );

// Protected routes

router.get('/profile', authMiddleware,getUserProfile);

module.exports = router;