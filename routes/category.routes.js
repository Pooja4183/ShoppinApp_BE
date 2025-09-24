const express = require("express");
const router = express.Router();
const {createCategory,getCategory,getCategoryById,replaceCategory,updateCategory,deleteCategory,countCategory} = require('../controllers/category.controller')


router.post('/',createCategory);

// for client and admin to get the all products
router.get("/", getCategory);

//for client and admin to get the product by id
router.get("/:id", getCategoryById);

// for admin to update the product Use: Replace all fields of a product.
router.put("/:id", replaceCategory);

// for admin, Use case: Update only certain fields (price, stock, etc.)
router.patch("/:id", updateCategory);

//Admin can remove product from db
router.delete("/:id", deleteCategory);

// admin can see the total product uploaded on the dashboard
router.get("/", countCategory);


module.exports = router;
