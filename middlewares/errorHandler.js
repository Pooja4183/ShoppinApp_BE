const errorHandler = (err, req, res, next) => {
  console.log(err.stack);
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Server error", success: false });
};

module.exports = errorHandler;
