const Color = require("../models/colorModel");

exports.createColor = async (req, res, next) => {
  try {
    const { colorName } = req.body

    // 3. Create new color
    const newColor = new Color({
    colorName,
    slug: colorName.toLowerCase().replace(/\s+/g, "-"), // auto create slug
     
    });
    await newColor.save();

    // 5. Response 201 code is for creating
    res.status(201).json({
      message: "color added successfully.",
      success: true,
      data: newColor,
    });
  } catch (error) {
    next(error);
  }
};

exports.getColor = async (req, res, next) => {
  try {
    const colorList = await Color.find();

    //You can filter: Product.find({ category: 'electronics' })

    console.log("color list from the db:", colorList);

    // staus 200 is success msg for fetching categories
    res.status(200).json({
      message: "color list fetched sussefully!",
      success: true,
      data: colorList,
    });
  } catch (err) {
    next(err);
  }
};

exports.getColorById = async (req, res, next) => {
  try {
    //findById is a shortcut for findOne({ _id: req.params.id }).
    const color = await Color.findById(req.params.id);
    if (!color) {
      const error = new Error("color not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json(color);
  } catch (err) {
    next(err);
  }
};

// AdminFor PUT, you should fetch the color and replace all fields:
exports.replaceColor = async (req, res, next) => {
  try {
    const updated = await Color.findOneAndUpdate(
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

exports.updateColor = async (req, res, next) => {
  try {
    const updated = await Color.findByIdAndUpdate(
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

// admin deletes a color
exports.deleteColor = async (req, res, next) => {
  try {
    const deletedColor = await Color.findByIdAndDelete(req.params.id);
    if (!deletedColor) {
      error.statusCode = 400;
      return next(error);
    }
    return res.status(200).json({ message: "Color deleted!" });
  } catch (error) {
    next(error);
  }
};

//Use case: Admin dashboard shows total categories.

exports.countColor = async (req, res, next) => {
  try {
    const count = await Color.countDocuments();
    res.status(200).json({ totalColors: count });
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
