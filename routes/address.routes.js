const express = require('express');
const router = express.Router();
const {createAddress, getAddress} = require('../controllers/address.controller');

const authMiddleware = require('../middlewares/auth.middleware');

// Public Routes
router.post('/',authMiddleware,createAddress );

// Protected routes
router.get('/', authMiddleware,getAddress);

module.exports = router;


