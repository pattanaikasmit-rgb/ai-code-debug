const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

const errorHandler = (error, _req, res, _next) => {
  console.error('Unhandled server error:', error);

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal server error',
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
