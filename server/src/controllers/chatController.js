const { saveChatHistory } = require('../services/historyService');
const { chatWithAI } = require('../services/openRouterService');

const chatAssistant = async (req, res, next) => {
  try {
    const { code = '', language = 'plaintext', question, history = [] } = req.body ?? {};

    if (typeof code !== 'string' || typeof language !== 'string' || typeof question !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'code, language, and question must be provided as strings.',
      });
    }

    if (!question.trim()) {
      return res.status(400).json({
        success: false,
        message: 'question cannot be empty.',
      });
    }

    if (!Array.isArray(history)) {
      return res.status(400).json({
        success: false,
        message: 'history must be an array when provided.',
      });
    }

    console.log('Received /api/chat payload:', {
      language,
      question,
      historyCount: history.length,
      userId: req.user?._id?.toString() || null,
    });

    const aiResponse = await chatWithAI({ code, language, question, history });
    const historyRecord = await saveChatHistory({
      code,
      language,
      question,
      history,
      aiResponse,
      user: req.user || null,
    });

    return res.status(200).json({
      success: true,
      message: 'AI chat response generated successfully.',
      data: {
        ...aiResponse,
        historyId: historyRecord?._id || null,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  chatAssistant,
};
