const { default: mongoose } = require("mongoose");
const Product = require("../../models/product.model");
const { isValidObjectId } = require("mongoose");
const {
  fetchProducts,
  createProduct,
} = require("../../services/product.service");
//const productService = require('../services/product.service');
const { ProductDto } = require("./product.dto");

exports.addProducts = async (req, res, next) => {
  try {
    const { title, description, price, category, brand, color } = req.body;

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const files = req.files;
    const productDto = {
      title,
      description,
      price,
      category,
      brand,
      color,
      baseUrl,
      files,
    };

    const newProduct = await createProduct(productDto);
    // 5. Response 201 code is for creating
    res.status(201).json({
      message: "Product added successfully.",
      success: true,
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const result = await fetchProducts(req.query);

    res.status(200).json({
      message: "Products fetched successfully!",
      success: true,
      data: result.products,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};

exports.getProductsById = async (req, res, next) => {
  const id = req.params.id;
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message: "Invalid product ID",
      success: false,
    });
  }

  try {
    //findById is a shortcut for findOne({ _id: req.params.id }).
    // const product = await Product.findById(req.params.id);
    const product = await Product.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true },
      },
    ]);
    if (!product.length) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      product: product[0],
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

// AdminFor PUT, you should fetch the product and replace all fields:
exports.replaceProduct = async (req, res, next) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, overwrite: true, runValidators: true },
    ); // overwrite replaces doc

    if (!updated) {
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};
// update partial field

exports.updateProduct = async (req, res, next) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { $set: req.body }, // only update provided fields
      { new: true, runValidators: true },
    );

    if (!updated) {
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// admin deletes a produts
exports.deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      error.statusCode = 400;
      return next(error);
    }
    return res.status(200).json({ message: "Product deleted!" });
  } catch (error) {
    next(error);
  }
};

//Use case: Admin dashboard shows total products.

exports.countProducts = async (req, res, next) => {
  try {
    const count = await Product.countDocuments();
    res.status(200).json({ totalProducts: count });
  } catch (error) {
    next(error);
  }
};

//Use case: Admin checks if a product title already exists before adding.

exports.checkProductExists = async (req, res, next) => {
  try {
    const exists = await Product.exists({ title: req.query.title });
    res.status(200).json({ exists: !!exists });
  } catch (error) {
    next(error);
  }
};
