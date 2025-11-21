const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const otpRoutes = require('./otp.routes');
const productRoutes = require('./product.routes');
const adminRoutes = require('./admin.routes');
const categoryRoutes = require('./category.routes');
const colorRoutes = require('./color.routes');
const brandRoutes = require('./brand.routes');
const appCategory = require('./app-category.routes');
const filtersRoutes = require('./allFilters.routes');
const DynamicFiltersRoutes = require('./filters.routes')

router.use('/auth', authRoutes);   // /api/auth/login
router.use('/users', userRoutes); // /api/users/register, /profile
router.use('/otp',otpRoutes);
router.use('/products',productRoutes);
router.use('/admin',adminRoutes);

//new routes for product category, brand and color

router.use('/category', categoryRoutes ); // this end point is to add and get the category from the admin panel
router.use('/brand',brandRoutes);
router.use('/color',colorRoutes);
router.use('/app-category',appCategory); // ths endpoint is to get the category related products 
router.use('/allfilters',filtersRoutes); // get all filters
router.use('/filters',DynamicFiltersRoutes); // get specific filters list




module.exports = router;