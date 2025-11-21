const Product = require("../models/productModel");

exports.getFilteredProducts = async (req, res, next) => {
  try {

    const { brand, color, minPrice, maxPrice, category } = req.query;

    const min = minPrice ? parseInt(minPrice) : 0;     // default 0 if minPrice not sent
    const max = maxPrice ? parseInt(maxPrice) : Infinity; // default Infinity if maxPrice not sent

    const filteredProducts = await Product.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },

      { $unwind: "$categoryDetails" },

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
       // Filter by categoryName, brand, color, price
       {
        $match: {
          ...(category ? { "categoryDetails.categoryName": { $regex: category, $options: "i" } } : {}),
          ...(brand ? { "brandDetails.brandName":  { $regex: brand, $options: "i" } } : {}),
          ...(color ? { "colorDetails.colorName":  { $regex: color, $options: "i" } } : {}),
          ...(minPrice || maxPrice
            ? { price: { $gte: min, $lte: max } }
            : {}),
         
        },
      },
    ]);

    res.status(200).json({
      message:"Filtered products feteched successfully",
      success:true,
      data:filteredProducts,
    })
  } catch (error) {
    next(error)
  }
};
