const Product = require("../models/product.model");

exports.getDynamicFilters = async (req, res, next) => {
  try {
    const { categoryName } = req.params;

    const filters = await Product.aggregate([
      // Lookup category details
      {
        $lookup: {
          from: "categories", // collection name in MongoDB
          localField: "category", // field in Product
          foreignField: "_id", // field in Category
          as: "categoryDetails", // alias name
        },
      },
      {
        $unwind: {
          path: "$categoryDetails",
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

      // Filter by category name ( in SQL its where when we find value WHERE category = 'men')
      {
        $match: {
          "categoryDetails.categoryName": {
            $regex: `^${categoryName}$`,
            $options: "i",
          },
        },
      },

      // Group all unique filter options

      {
        $facet: {
          // 🔥 BRAND COUNT
          brands: [
            {
              $group: {
                _id: "$brandDetails.brandName", // group by brand
                count: { $sum: 1 }, // count products
              },
            },
            {
              $project: {
                _id: 0,
                name: "$_id", // rename field
                count: 1,
              },
            },
          ],

          // 🔥 COLOR COUNT
          colors: [
            {
              $group: {
                _id: "$colorDetails.colorName",
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                name: "$_id",
                count: 1,
              },
            },
          ],

          // 🔥 PRICE RANGE
          priceRange: [
            {
              $group: {
                _id: null,
                min: { $min: "$price" },
                max: { $max: "$price" },
              },
            },
          ],
        },
      },

      // Choose which fields to send back ( this is select in SQL Select id, title, price etc, it which category name is men just show their data onlyfrom the collection. )
      {
        $project: {
          brands: 1,
          colors: 1,
          priceRange: { $arrayElemAt: ["$priceRange", 0] },
        },
      },
    ]);

    // staus 200 is success msg for fetching products
    res.status(200).json({
      message: "Dynamic filters fetched successfully",
      success: true,
      data: filters[0] || { brands: [], colors: [], priceRange: {} },
    });
  } catch (err) {
    next(err);
  }
};
