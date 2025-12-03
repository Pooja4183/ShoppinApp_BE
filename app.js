const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorHandler');
const path = require('path');

const app = express();

// imported Routes
const allRoutes = require('./routes/index')

//application (global) middleware
app.use(cors({origin:process.env.FRONTEND_URL || "http://localhost:3000", credentials:true}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use(cookieParser());


// app.use('/users',router);

// this is Express’s built-in static middleware.
// Purpose: serve files (images, CSS, JS, etc.) from a folder so the browser can access them via URL.
// app.use('/uploads',express.static('uploads')); // server images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//define routes
app.use('/api',allRoutes); //Mounts all grouped routes under /api

// error handler middleware
app.use(errorHandler);

module.exports = app;


