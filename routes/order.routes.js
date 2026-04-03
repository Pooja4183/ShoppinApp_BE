const express = require('express');
const router = express.Router();
const {placeOrder, getMyOrders,getSingleOrder,cancelOrder } = require('../controllers/orderPocess/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// for user 
router.post('/', authMiddleware,placeOrder); // this route is to create the order 
router.get('/my-orders',authMiddleware,getMyOrders); // to get all orders list of logged in user
router.get('/:orderId',authMiddleware,getSingleOrder) // to get single order detail
router.patch('/cancel/:orderId',authMiddleware,cancelOrder);


// for admin
// router.get('/', authMiddleware,getAllOrder); // this route is to create the order 



module.exports = router
