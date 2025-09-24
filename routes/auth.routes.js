const express = require('express');
const router = express.Router();
const {loginUser} = require('../controllers/auth.controller');

// Post /api/auth/login
router.post('/login',loginUser);

// router.post('/mailer',nodemailerTesting);


module.exports = router;