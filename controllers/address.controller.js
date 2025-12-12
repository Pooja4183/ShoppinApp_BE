const { default: mongoose } = require("mongoose");
const Address = require("../models/UserAdddressModel");
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

exports.getAddressOfUser = async (req, res, next) => {
  try {
    // Extract the logged-in user's ID from the verified JWT token
const userId = req.user._id || req.user.id;

    // find all address where userID matches
    const address = await Address.find({ userId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 }); // optional: latest address first;

    //if no address found
    if (!address.length) {
      return res.status(200).json({
        message: "No address found for this user.",
        success: true,
        data: [],
      });
    }

    // send the address
    res.status(200).json({
      message: "Address fetched successfully.",
      success: true,
      data: address,
    });
  } catch (error) {
    console.log("Error fetching address by ID", error);
  res.status(500).json({
    message:"Server error while fetching addresses.",
    success:false,
    error:error.message,
  })

    next(error);
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
