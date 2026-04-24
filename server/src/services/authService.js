const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Session = require('../models/Session');

const getAuthConfig = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    const error = new Error('JWT_SECRET is not configured. Add it to server/.env before using authentication.');
    error.statusCode = 500;
    throw error;
  }

  return {
    secret,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    issuer: process.env.JWT_ISSUER || 'ai-code-debugger',
  };
};

const getClientMetadata = (req) => {
  const forwardedFor = req.headers['x-forwarded-for'];
  const ipAddress = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : typeof forwardedFor === 'string'
      ? forwardedFor.split(',')[0].trim()
      : req.ip || '';

  return {
    ipAddress,
    userAgent: req.get('user-agent') || '',
  };
};

const formatUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
});

const createAuthSession = async ({ user, req }) => {
  const { secret, expiresIn, issuer } = getAuthConfig();
  const sessionId = crypto.randomUUID();

  const token = jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      sessionId,
    },
    secret,
    {
      expiresIn,
      issuer,
    }
  );

  const decodedToken = jwt.decode(token);
  const expiresAt = decodedToken?.exp ? new Date(decodedToken.exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const session = await Session.create({
    sessionId,
    user: user._id,
    expiresAt,
    ...getClientMetadata(req),
  });

  return {
    token,
    session,
    user: formatUser(user),
  };
};

const verifyAccessToken = (token) => {
  const { secret, issuer } = getAuthConfig();
  return jwt.verify(token, secret, { issuer });
};

module.exports = {
  createAuthSession,
  formatUser,
  verifyAccessToken,
};
