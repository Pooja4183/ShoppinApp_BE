const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const {
  addProducts,
  getProducts,
  getProductsById,
  replaceProduct,
  updateProduct,
  deleteProduct,
  countProducts,
} = require("../controllers/product.controller");

// for admin to add the product and single image
//router.post("/", upload.single("image"), addProducts);

// for admin to add the product and single image
router.post("/", upload.array("images", 5), addProducts);

// for admin to update the product Use: Replace all fields of a product.
router.put("/:id", replaceProduct);

// for admin, Use case: Update only certain fields (price, stock, etc.)
router.patch("/:id", updateProduct);

//Admin can remove product from db
router.delete("/:id", deleteProduct);

// for client and admin to get the all products
router.get("/", getProducts);

// admin can see the total product uploaded on the dashboard
router.get("/", countProducts);

//for client and admin to get the product by id
router.get("/:id", getProductsById);

module.exports = router;
