const express = require('express');
const router = express.Router();

const verifyRazorpayWebhook = require('../middlewares/webhook.middleware');
const{handleRazorpayWebhook}= require('../controllers/orderPocess/webhook.controller');

router.post('/',express.raw({type:'application/json'}),verifyRazorpayWebhook,handleRazorpayWebhook);

module.exports = router;