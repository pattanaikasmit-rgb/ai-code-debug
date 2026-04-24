const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { createAuthSession, formatUser } = require('../services/authService');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

const validateCredentials = ({ name, email, password }, isSignup = false) => {
  if (typeof email !== 'string' || typeof password !== 'string') {
    return 'Email and password are required.';
  }

  if (!emailPattern.test(email.trim().toLowerCase())) {
    return 'Please provide a valid email address.';
  }

  if (password.trim().length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
  }

  if (isSignup && (typeof name !== 'string' || name.trim().length < 2)) {
    return 'Name must be at least 2 characters long.';
  }

  return '';
};

const signupUser = async (req, res, next) => {
  try {
    const { name = '', email, password } = req.body ?? {};
    const validationMessage = validateCredentials({ name, email, password }, true);

    if (validationMessage) {
      return res.status(400).json({
        success: false,
        message: validationMessage,
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    const authData = await createAuthSession({ user, req });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: authData,
    });
  } catch (error) {
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};
    const validationMessage = validateCredentials({ email, password }, false);

    if (validationMessage) {
      return res.status(400).json({
        success: false,
        message: validationMessage,
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const authData = await createAuthSession({ user, req });

    return res.status(200).json({
      success: true,
      message: 'Signed in successfully.',
      data: authData,
    });
  } catch (error) {
    return next(error);
  }
};

const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      user: formatUser(req.user),
      sessionId: req.session.sessionId,
    },
  });
};

const logoutUser = async (req, res, next) => {
  try {
    req.session.isRevoked = true;
    await req.session.save();

    return res.status(200).json({
      success: true,
      message: 'Signed out successfully.',
    });
  } catch (error) {
    return next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body ?? {};

    if (!email || typeof email !== 'string' || !emailPattern.test(email.trim().toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    // For security, do not reveal whether the email exists.
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with the provided email, a password reset email will be sent shortly.',
      });
    }

    // Here you would generate a reset token + email it; in this demo we only respond with a placeholder.
    return res.status(200).json({
      success: true,
      message: 'If an account exists with the provided email, a password reset email will be sent shortly.',
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  signupUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  forgotPassword,
};
