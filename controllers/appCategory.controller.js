const Product = require("../models/productModel");

exports.getAppCategory = async (req, res, next) => {
  try {
    const {categoryName} = req.params;

    const products = await Product.aggregate([
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

      // Choose which fields to send back ( this is select in SQL Select id, title, price etc, it which category name is men just show their data onlyfrom the collection. )

      {
        $project: {
          _id: 1,
          title: 1,
          price: 1,
          description: 1,
          images:1,
          "categoryDetails.categoryName": 1,
          "brandDetails.brandName": 1,
          "colorDetails.colorName": 1,
        },
      },
    ]);

    console.log("Products from the db:", products);

    // staus 200 is success msg for fetching products
    res.status(200).json({
      message: "Category list fetched sussefully!",
      success: true,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};
