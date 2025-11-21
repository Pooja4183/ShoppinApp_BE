const express = require("express");
const router = express.Router();
const{getAllfilters}  = require('../controllers/allFilters.controller');

router.get('/', getAllfilters);


module.exports = router;
