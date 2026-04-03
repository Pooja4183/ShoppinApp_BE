const express = require('express');
const router = express.Router();
const addressController  = require('../controllers/address.controller');

const authMiddleware = require('../middlewares/auth.middleware');

// Public Routes
router.post('/',authMiddleware,addressController.createAddress );

router.put("/:id",authMiddleware,addressController.updateAddress)

// Protected routes
router.get('/', authMiddleware,addressController.getAddressOfUser);

// admin route
router.get('/all-address',addressController.getMyAddress);



module.exports = router;


