const mongoose = require('mongoose');
const CodeHistory = require('../models/CodeHistory');
const User = require('../models/User');

const isDatabaseReady = () => mongoose.connection.readyState === 1;

const resolveUser = async (userData) => {
  if (!userData || typeof userData !== 'object') {
    return null;
  }

  if (userData._id) {
    return User.findById(userData._id).select('_id name email');
  }

  if (typeof userData.email === 'string' && userData.email.trim()) {
    return User.findOne({ email: userData.email.trim().toLowerCase() }).select('_id name email');
  }

  return null;
};

const saveDebugHistory = async ({ code, language, aiResponse, user }) => {
  if (!isDatabaseReady()) {
    return null;
  }

  try {
    const existingUser = await resolveUser(user);

    return await CodeHistory.create({
      user: existingUser?._id || null,
      type: 'debug',
      language,
      code,
      aiResponse: {
        model: aiResponse?.model || '',
        analysis: aiResponse?.analysis || null,
        raw: aiResponse?.raw || '',
      },
    });
  } catch (error) {
    console.error('Failed to save debug history:', error.message);
    return null;
  }
};

const saveChatHistory = async ({ code, language, question, history = [], aiResponse, user }) => {
  if (!isDatabaseReady()) {
    return null;
  }

  try {
    const existingUser = await resolveUser(user);
    const safeConversation = history
      .filter((message) => message && typeof message.role === 'string' && typeof message.content === 'string')
      .map((message) => ({
        role: message.role === 'assistant' ? 'assistant' : 'user',
        content: message.content,
      }));

    safeConversation.push({ role: 'user', content: question });
    safeConversation.push({ role: 'assistant', content: aiResponse?.reply || '' });

    return await CodeHistory.create({
      user: existingUser?._id || null,
      type: 'chat',
      language,
      code,
      question,
      conversation: safeConversation,
      aiResponse: {
        model: aiResponse?.model || '',
        reply: aiResponse?.reply || '',
      },
    });
  } catch (error) {
    console.error('Failed to save chat history:', error.message);
    return null;
  }
};

module.exports = {
  saveDebugHistory,
  saveChatHistory,
};
