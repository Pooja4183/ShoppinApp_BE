const Category = require("../models/categoryModel");

exports.createCategory = async (req, res, next) => {
  try {
    const { categoryName } = req.body

    // 3. Create new category
    const newCategory = new Category({
     categoryName,
    slug: categoryName.toLowerCase().replace(/\s+/g, "-"), // auto create slug
     
    });
    await newCategory.save();

    // 5. Response 201 code is for creating
    res.status(201).json({
      message: "category added successfully.",
      success: true,
      data: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const categoryList = await Category.find();

    //You can filter: Product.find({ category: 'electronics' })

    console.log("Category from the db:", categoryList);

    // staus 200 is success msg for fetching categories
    res.status(200).json({
      message: "categories fetched sussefully!",
      success: true,
      data: categoryList,
    });
  } catch (err) {
    next(err);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    //findById is a shortcut for findOne({ _id: req.params.id }).
    const category = await Category.findById(req.params.id);
    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json(category);
  } catch (err) {
    next(err);
  }
};

// AdminFor PUT, you should fetch the product and replace all fields:
exports.replaceCategory = async (req, res, next) => {
  try {
    const updated = await Category.findOneAndUpdate(
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

exports.updateCategory = async (req, res, next) => {
  try {
    const updated = await Category.findByIdAndUpdate(
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
exports.deleteCategory = async (req, res, next) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      error.statusCode = 400;
      return next(error);
    }
    return res.status(200).json({ message: "Product deleted!" });
  } catch (error) {
    next(error);
  }
};

//Use case: Admin dashboard shows total categories.

exports.countCategory = async (req, res, next) => {
  try {
    const count = await Category.countDocuments();
    res.status(200).json({ totalProducts: count });
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
