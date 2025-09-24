const express = require("express");
const router = express.Router();
const {createBrand,getBrand,getBrandById,replaceBrand,updateBrand,deleteBrand,countBrand} = require('../controllers/brand.controller')


router.post('/',createBrand);

// for client and admin to get the all products
router.get("/", getBrand);

// admin can see the total product uploaded on the dashboard
router.get("/", countBrand);

//for client and admin to get the product by id
router.get("/:id", getBrandById);

// for admin to update the product Use: Replace all fields of a product.
router.put("/:id", replaceBrand);

// for admin, Use case: Update only certain fields (price, stock, etc.)
router.patch("/:id", updateBrand);

//Admin can remove product from db
router.delete("/:id", deleteBrand);




module.exports = router;
