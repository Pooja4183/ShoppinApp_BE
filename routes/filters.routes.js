const express = require("express");
const router = express.Router();
const {getFilters} = require('../controllers/filters.controller')

router.get('/', getFilters)

module.exports = router;
