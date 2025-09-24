const { default: mongoose } = require("mongoose");
const Product = require("../models/productModel");

exports.addProducts = async (req, res, next) => {
  try {
    const { title, description, price, category, brand, color } = req.body;

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // 3. Create new user
    const newProduct = new Product({
      title,
      description,
      price,
      category,
      brand,
      color,
      //image:req.file ? req.file.filename:null, // multer add req.file for single image
      images: req.files
        ? req.files.map((file) => ({
            original: file.originalname,
            saved: file.filename,
            url: `${baseUrl}/uploads/${file.filename}`,
          }))
        : [], // <-- full path here
    });
    await newProduct.save();

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
    // const products = await Product.find()
    // .populate("Category", "name slug") // only fetch name and slug
    // .populate("Brand", "name logo")
    // .populate("Color", "name hexCode");

    //You can filter: Product.find({ category: 'electronics' })

    const products = await Product.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: {
          path: "$categoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      // join the brand
      {
        $lookup: {
          from: "brands",
          localField: "brand",
          foreignField: "_id",
          as: "brandDetails",
        },
      },
      {
        $unwind: {
          path: "$brandDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      // join the color
      {
        $lookup: {
          from: "colors",
          localField: "color",
          foreignField: "_id",
          as: "colorDetails",
        },
      },
      {
        $unwind: {
          path: "$colorDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    console.log("Products from the db:", products);

    // staus 200 is success msg for fetching products
    res.status(200).json({
      message: "Products fetched sussefully!",
      success: true,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

exports.getProductsById = async (req, res, next) => {
  try {
    //findById is a shortcut for findOne({ _id: req.params.id }).
    // const product = await Product.findById(req.params.id);
    const product = await Product.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId.createFromHexString(req.params.id),
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
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json(product);
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
      { new: true, overwrite: true, runValidators: true }
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
      { new: true, runValidators: true }
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
