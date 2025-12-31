const express = require('express');
const router = express.Router();
const {placeOrder} = require('../controllers/orderPocess/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware,placeOrder); // this route is to create the order 

module.exports = router
