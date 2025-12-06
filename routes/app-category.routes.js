const express = require("express");
const router = express.Router();
const {getAppCategory} = require('../controllers/appCategory.controller');
const cachemiddleWare = require("../middlewares/cacheMiddleware");


// for client and admin to get the all category related products
router.get("/:categoryName",cachemiddleWare("category",3600), getAppCategory)


module.exports = router;
