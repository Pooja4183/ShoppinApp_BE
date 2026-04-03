const mongoose = require("mongoose");
const Product = require("../models/product.model");
const { ProductDto, title } = require("../controllers/products/product.dto");

// Import models for lookup
const Category = require("../models/category.model");
const Brand = require("../models/brand.model");
const Color = require("../models/color.model");

/**
 * Reusable name → ObjectId filter (FIXED)
 * - Case insensitive match
 * - No empty result bug
 */
const applyNameFilter = async (query, field, value, Model, nameField) => {
  if (!value) return;

  const names = value.split(",").map((n) => n.trim());

  // Case-insensitive exact match
  const docs = await Model.find({
    [nameField]: {
      $in: names.map((n) => new RegExp(`^${n}$`, "i")),
    },
  }).select("_id");

  const ids = docs.map((d) => d._id);

  // ✅ IMPORTANT FIX:
  // If nothing found → DO NOT apply filter
  if (!ids.length) return;

  query[field] = { $in: ids };
};

/**
 *  Create Product
 */
exports.createProduct = async (productDto) => {
  const dto = new ProductDto(productDto);

  const { title, description, price, category, brand, color, baseUrl, files } =
    dto;

  const newProduct = new Product({
    title,
    description,
    price,
    category,
    brand,
    color,
    images: files
      ? files.map((file) => ({
          original: file.originalname,
          saved: file.filename,
          url: `${baseUrl}/uploads/${file.filename}`,
        }))
      : [],
  });

  return await newProduct.save();
};

/**
 *  Fetch Products with Filters, Sorting, Pagination
 */
exports.fetchProducts = async (queryParams) => {
  const {
    page = 1,
    limit = 10,
    category,
    brand,
    color,
    priceMin,
    priceMax,
    rating,
    search,
    sort,
  } = queryParams;

  let query = {};

  //  Apply filters
  await applyNameFilter(query, "category", category, Category, "categoryName");
  await applyNameFilter(query, "brand", brand, Brand, "brandName");
  await applyNameFilter(query, "color", color, Color, "colorName");

  // Price filter
  if (priceMin || priceMax) {
    query.price = {};
    if (priceMin) query.price.$gte = Number(priceMin);
    if (priceMax) query.price.$lte = Number(priceMax);
  }

  //  Rating filter
  if (rating) {
    query.rating = { $gte: Number(rating) };
  }

  //  Search (case-insensitive)
  if (search) {
    const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${safeSearch}\\b`, "i");

    let searchQuery = {};

    await applyNameFilter(
      searchQuery,
      "category",
      search,
      Category,
      "categoryName",
    );
    await applyNameFilter(searchQuery, "brand", search, Brand, "brandName");
    await applyNameFilter(searchQuery, "color", search, Color, "colorName");

    const orConditions = [
      { title: regex },
      ...(searchQuery.category ? [{ category: searchQuery.category }] : []),
      ...(searchQuery.brand ? [{ brand: searchQuery.brand }] : []),
      ...(searchQuery.color ? [{ color: searchQuery.color }] : []),
    ];

    //  KEY FIX
    query = {
      $and: [
        query, // existing filters
        { $or: orConditions },
      ],
    };
  }

  //  Sorting
  let sortOption = { createdAt: -1 };

  if (sort) {
    const [field, order] = sort.split("_");
    const allowedFields = ["price", "createdAt"];

    if (allowedFields.includes(field)) {
      sortOption = {
        [field]: order === "asc" ? 1 : -1,
      };
    }
  }

  //  Pagination
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  //  Debug logs (remove in production)
  console.log("QUERY PARAMS:", queryParams);
  console.log("FINAL QUERY:", query);

  //  Execute query
  const [products, total] = await Promise.all([
    Product.find(query)
      .populate("category", "categoryName")
      .populate("brand", "brandName")
      .populate("color", "colorName")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber)
      .lean(),

    Product.countDocuments(query),
  ]);

  return {
    products,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
      hasNextPage: pageNumber < Math.ceil(total / limitNumber),
      hasPrevPage: pageNumber > 1,
    },
  };
};
