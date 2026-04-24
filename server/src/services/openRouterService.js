const axios = require('axios');

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

const buildDebugPrompt = ({ code, language }) => `Analyze the following ${language} code and do all of the following:
1. Detect errors or likely bugs
2. Suggest fixes
3. Provide corrected code
4. Provide the expected output of the corrected code
5. Explain the solution simply

Return valid JSON with this exact shape:
{
  "errors": ["..."],
  "fixes": ["..."],
  "correctedCode": "...",
  "output": "...",
  "explanation": "..."
}

Code to debug:
${code}`;

const parseAiContent = (content) => {
  if (!content) {
    return {
      raw: '',
      parsed: null,
    };
  }

  try {
    return {
      raw: content,
      parsed: JSON.parse(content),
    };
  } catch {
    return {
      raw: content,
      parsed: null,
    };
  }
};

const getHeaders = (apiKey) => ({
  Authorization: `Bearer ${apiKey}`,
  'Content-Type': 'application/json',
  'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:5000',
  'X-Title': process.env.OPENROUTER_APP_NAME || 'AI Code Debugger',
});

const requestOpenRouter = async ({ messages, temperature = 0.2 }) => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    const error = new Error('OpenRouter API key is not configured. Add OPENROUTER_API_KEY to your server .env file.');
    error.statusCode = 500;
    throw error;
  }

  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: DEFAULT_MODEL,
        messages,
        temperature,
      },
      {
        headers: getHeaders(apiKey),
        timeout: 30000,
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;

    if (!content) {
      const error = new Error('OpenRouter returned an empty response.');
      error.statusCode = 502;
      throw error;
    }

    return {
      model: response.data?.model || DEFAULT_MODEL,
      content,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message ||
        'Unknown OpenRouter error';

      const requestError = new Error(`OpenRouter request failed: ${apiMessage}`);
      requestError.statusCode = error.response?.status || 502;
      throw requestError;
    }

    throw error;
  }
};

const analyzeCodeWithAI = async ({ code, language }) => {
  const { model, content } = await requestOpenRouter({
    messages: [
      {
        role: 'system',
        content:
          'You are a debugging assistant. Find code issues, suggest fixes, provide corrected code, and explain clearly for beginners.',
      },
      {
        role: 'user',
        content: buildDebugPrompt({ code, language }),
      },
    ],
    temperature: 0.2,
  });

  const parsedContent = parseAiContent(content);

  return {
    model,
    analysis: parsedContent.parsed,
    raw: parsedContent.raw,
  };
};

const chatWithAI = async ({ code, language, question, history = [] }) => {
  const safeHistory = history
    .filter((message) => message && typeof message.role === 'string' && typeof message.content === 'string')
    .slice(-10)
    .map((message) => ({
      role: message.role === 'assistant' ? 'assistant' : 'user',
      content: message.content,
    }));

  const { model, content } = await requestOpenRouter({
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful coding assistant. Answer clearly, reference the provided code, explain simply, and help the user debug or improve their code like a friendly ChatGPT-style assistant.',
      },
      {
        role: 'user',
        content: `Current language: ${language}\n\nCurrent code:\n${code || '(No code provided yet.)'}`,
      },
      ...safeHistory,
      {
        role: 'user',
        content: question,
      },
    ],
    temperature: 0.4,
  });

  return {
    model,
    reply: content,
  };
};

module.exports = {
  analyzeCodeWithAI,
  chatWithAI,
};
