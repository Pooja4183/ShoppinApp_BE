const Color = require("../models/colorModel");
const Brand = require("../models/brandModel");
const Gender = require("../models/categoryModel");

exports.getAllfilters = async (req, res, next) => {
  try {
    const colorList = await Color.find({}, "colorName");
    const brandList = await Brand.find({}, "brandName");
    const categoryList = await Gender.find({}, "categoryName gender");

     // Optional: hardcoded price ranges
    const priceRanges = [
      { label: "Under ₹1000", min: 0, max: 1000 },
      { label: "₹1000–₹3000", min: 1000, max: 3000 },
      { label: "₹3000–₹5000", min: 3000, max: 5000 },
      { label: "₹5000 & above", min: 5000, max: 10000 },
    ];

    console.log("Filter list from the db:", colorList);

    // staus 200 is success msg for fetching categories
    res.status(200).json({
      message: "filter list fetched sussefully!",
      success: true,
      filters: { 
       brand: brandList.map(b=>b.brandName),
       color: colorList.map(c=>c.colorName),
        category: categoryList.map(g=>g.categoryName), // extract unique genders
        priceRanges
      },
    });
  } catch (err) {
    next(err);
  }
};
