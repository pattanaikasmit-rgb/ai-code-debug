const mongoose = require('mongoose');
const { connectDatabase } = require('../config/db');

const requireDatabase = async (_req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  const isConnected = await connectDatabase();
  if (isConnected) {
    return next();
  }

  return res.status(503).json({
    success: false,
    message: 'Database is unavailable. Please try again shortly.',
  });
};

module.exports = {
  requireDatabase,
};
