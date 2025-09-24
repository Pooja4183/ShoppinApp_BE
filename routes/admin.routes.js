const express = require('express');
const router = express.Router();
const {registerAdmin,loginAdmin, getAdminProfile} = require('../controllers/admin.controller');

// Protected routes only developer can create the admin
router.post('/register',registerAdmin );

//login route for admin to login
 router.post('/login',loginAdmin);

// admin will sse the profile after successfull login
// router.get('/profile',getAdminProfile);

module.exports = router;