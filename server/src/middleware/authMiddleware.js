const Session = require('../models/Session');
const User = require('../models/User');
const { verifyAccessToken } = require('../services/authService');

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token is required.',
      });
    }

    const token = authHeader.slice(7).trim();
    const payload = verifyAccessToken(token);

    const session = await Session.findOne({
      sessionId: payload.sessionId,
      user: payload.sub,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Session is invalid or has expired. Please sign in again.',
      });
    }

    const user = await User.findById(payload.sub).select('_id name email');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account no longer exists.',
      });
    }

    session.lastActivityAt = new Date();
    await session.save();

    req.user = user;
    req.session = session;
    return next();
  } catch (error) {
    if (error.statusCode === 500) {
      return next(error);
    }

    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Please sign in again.',
    });
  }
};

module.exports = {
  authenticateUser,
};
