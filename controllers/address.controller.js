const { default: mongoose } = require("mongoose");
const  Address = require("../models/UserAdddressModel");
const { isValidObjectId } = require("mongoose");

exports.createAddress = async (req, res, next) => {
  try {
    const {
      name,
      address,
      mobile,
      pin_Code,
      town_city,
      country,
      state,
      landmark,
    
    } = req.body;

     // ✅ extract user id from JWT middleware
    const userId = req.user.id;

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // 3. Create new address
    const newAddress = new Address({
      name,
      address,
      mobile,
      pin_Code,
      town_city,
      country,
      state,
      landmark,
      userId,
    });
    await newAddress.save();

    // 5. Response 201 code is for creating
    res.status(201).json({
      message: "Address added successfully.",
      success: true,
      data: newAddress,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAddress = async (req, res, next) => {
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

    // console.log("Products from the db:", products);

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

// get product by search querry
exports.getProductsBySearch = async (req, res, next) => {
  const { query } = req.query; // // Get search query from URL parameter (only value )
  if (!query) {
    return res
      .status(400)
      .json({ message: "Search query is required", success: false });
  }
  try {
    const data = await Product.find({
      // Case-insensitive search on 'name' field
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

//
