const express = require('express');
const router = express.Router();
const addressController  = require('../controllers/address.controller');

const authMiddleware = require('../middlewares/auth.middleware');

// Public Routes
router.post('/',authMiddleware,addressController.createAddress );

// Protected routes
router.get('/', authMiddleware,addressController.getAddressOfUser);

module.exports = router;


