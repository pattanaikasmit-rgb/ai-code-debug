const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const codeHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    type: {
      type: String,
      enum: ['debug', 'chat'],
      required: true,
    },
    language: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      trim: true,
      default: '',
    },
    conversation: {
      type: [conversationSchema],
      default: [],
    },
    aiResponse: {
      model: {
        type: String,
        default: '',
      },
      analysis: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },
      raw: {
        type: String,
        default: '',
      },
      reply: {
        type: String,
        default: '',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CodeHistory', codeHistorySchema);
