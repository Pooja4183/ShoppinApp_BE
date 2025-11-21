const Product = require("../models/productModel");

exports.getDynamicFilters = async (req, res, next) => {
  try {
    const {categoryName} = req.params;

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
          "categoryDetails.categoryName": {$regex:`^${categoryName}$`,$options:"i"},
        },
      },

      // Group all unique filter options

      {
        $group:{
            _id:null,
            brands:{$addToSet:"$brandDetails.brandName"},
             colors:{$addToSet:"$colorDetails.colorName"},
               minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
        },

      

      // Choose which fields to send back ( this is select in SQL Select id, title, price etc, it which category name is men just show their data onlyfrom the collection. )

      {
        $project: {
          _id: 0,
          price: 1,
          brands: 1,
          colors: 1,
          priceRange: {
            min: "$minPrice",
            max: "$maxPrice",
        //   "categoryDetails.categoryName": 1,
        //   "brandDetails.brandName": 1,
        //   "colorDetails.colorName": 1,
        },
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
