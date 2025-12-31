const { default: mongoose } = require("mongoose");
const Product = require("../models/product.model");
const { isValidObjectId } = require("mongoose");
const {ProductDto} = require('../controllers/products/product.dto')

exports.createProduct = async(productDto) => {
    const { title, description, price, category, brand, color, baseUrl } = productDto;
      // 3. Create new PRODUCT
    const newProduct = new Product({
      title,
      description,
      price,
      category,
      brand,
      color,
      //image:req.file ? req.file.filename:null, // multer add req.file for single image
      images: req.files
        ? req.files.map((file) => ({
            original: file.originalname,
            saved: file.filename,
            url: `${baseUrl}/uploads/${file.filename}`,
          }))
        : [], // <-- full path here
    });
    await newProduct.save();

}
exports.fetchProducts = async () => {
    // const products = await Product.find()
    // .populate("Category", "name slug") // only fetch name and slug
    // .populate("Brand", "name logo")
    // .populate("Color", "name hexCode");

    //You can filter: Product.find({ category: 'electronics' })

   

    // console.log("Products from the db:", products);

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

        return products;
}