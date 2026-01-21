const express = require('express');
const router = express.Router();
const {placeOrder, getOrder } = require('../controllers/orderPocess/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware,placeOrder); // this route is to create the order 
router.get('./',authMiddleware,getOrder);

module.exports = router
