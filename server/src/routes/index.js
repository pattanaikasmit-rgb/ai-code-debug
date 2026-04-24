const express = require('express');
const { loginUser, signupUser, getCurrentUser, logoutUser, forgotPassword } = require('../controllers/authController');
const { debugCode } = require('../controllers/debugController');
const { chatAssistant } = require('../controllers/chatController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { requireDatabase } = require('../middleware/requireDatabase');

const router = express.Router();

router.get('/', (_req, res) => {
  res.status(200).send('Server is running');
});

router.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'AI Code Debugger API is running.',
    databaseReady: require('mongoose').connection.readyState === 1,
    timestamp: new Date().toISOString(),
  });
});

router.post('/api/auth/signup', requireDatabase, signupUser);
router.post('/api/auth/login', requireDatabase, loginUser);
router.post('/api/auth/forgot-password', requireDatabase, forgotPassword);
router.get('/api/auth/me', requireDatabase, authenticateUser, getCurrentUser);
router.post('/api/auth/logout', requireDatabase, authenticateUser, logoutUser);

router.post('/api/debug', requireDatabase, authenticateUser, debugCode);
router.post('/api/chat', requireDatabase, authenticateUser, chatAssistant);

module.exports = router;
