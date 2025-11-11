const express = require("express");
const router = express.Router();
const {getAppCategory} = require('../controllers/appCategory.controller')


// for client and admin to get the all category related products
router.get("/:categoryName", getAppCategory)


module.exports = router;
