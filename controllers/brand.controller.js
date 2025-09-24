const Brand = require("../models/brandModel");

exports.createBrand = async (req, res, next) => {
  try {
    const { brandName } = req.body

    // 3. Create new category
    const newBrand = new Brand({
     brandName,
    slug: brandName.toLowerCase().replace(/\s+/g, "-"), // auto create slug
     
    });
    await newBrand.save();

    // 5. Response 201 code is for creating
    res.status(201).json({
      message: "category added successfully.",
      success: true,
      data: newBrand,
    });
  } catch (error) {
    next(error);
  }
};

exports.getBrand = async (req, res, next) => {
  try {
    const brandList = await Brand.find();

    //You can filter: Product.find({ category: 'electronics' })

    console.log("Brand from the db:", brandList);

    // staus 200 is success msg for fetching brands
    res.status(200).json({
      message: "categories fetched sussefully!",
      success: true,
      data: brandList,
    });
  } catch (err) {
    next(err);
  }
};

exports.getBrandById = async (req, res, next) => {
  try {
    //findById is a shortcut for findOne({ _id: req.params.id }).
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      const error = new Error("Brand not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json(brand);
  } catch (err) {
    next(err);
  }
};

// AdminFor PUT, you should fetch the brand and replace all fields:
exports.replaceBrand = async (req, res, next) => {
  try {
    const updated = await Brand.findOneAndUpdate(
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

exports.updateBrand = async (req, res, next) => {
  try {
    const updated = await Brand.findByIdAndUpdate(
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

// admin deletes a category
exports.deleteBrand = async (req, res, next) => {
  try {
    const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
    if (!deletedBrand) {
      error.statusCode = 400;
      return next(error);
    }
    return res.status(200).json({ message: "Brand deleted!" });
  } catch (error) {
    next(error);
  }
};

//Use case: Admin dashboard shows total brands.

exports.countBrand = async (req, res, next) => {
  try {
    const count = await Brand.countDocuments();
    res.status(200).json({ totalBrands: count });
  } catch (error) {
    next(error);
  }
};

//Use case: Admin checks if a category already exists before adding.

exports.checkProductExists = async (req, res, next) => {
  try {
    const exists = await Product.exists({ title: req.query.title });
    res.status(200).json({ exists: !!exists });
  } catch (error) {
    next(error);
  }
};
