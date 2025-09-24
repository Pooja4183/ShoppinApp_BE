const express = require("express");
const router = express.Router();
const {createColor,getColor,getColorById,replaceColor,updateColor,deleteColor,countColor} = require('../controllers/color.controller')


router.post('/',createColor);

// for client and admin to get the all products
router.get("/", getColor);

//for client and admin to get the product by id
router.get("/:id", getColorById);

// for admin to update the product Use: Replace all fields of a product.
router.put("/:id", replaceColor);

// for admin, Use case: Update only certain fields (price, stock, etc.)
router.patch("/:id", updateColor);

//Admin can remove product from db
router.delete("/:id", deleteColor);

// admin can see the total product uploaded on the dashboard
router.get("/", countColor);


module.exports = router;
