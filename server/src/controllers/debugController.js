const { saveDebugHistory } = require('../services/historyService');
const { analyzeCodeWithAI } = require('../services/openRouterService');

const debugCode = async (req, res, next) => {
  try {
    const { code, language } = req.body ?? {};

    if (typeof code !== 'string' || typeof language !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Both code and language must be provided as strings.',
      });
    }

    if (!code.trim() || !language.trim()) {
      return res.status(400).json({
        success: false,
        message: 'code and language cannot be empty.',
      });
    }

    console.log('Received /api/debug payload:', { code, language, userId: req.user?._id?.toString() || null });

    const aiResponse = await analyzeCodeWithAI({ code, language });
    const historyRecord = await saveDebugHistory({ code, language, aiResponse, user: req.user || null });

    return res.status(200).json({
      success: true,
      message: 'AI debug analysis completed successfully.',
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
  debugCode,
};
