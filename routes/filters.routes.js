const express = require("express");
const router = express.Router();
const {getDynamicFilters} = require('../controllers/dynamicFilters.controller')

router.get('/:categoryName', getDynamicFilters);


module.exports = router;
