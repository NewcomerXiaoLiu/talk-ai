import dotenv from 'dotenv';

dotenv.config();

export default {
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  ai: {
    provider: 'doubao',
    doubao: {
      apiKey: process.env.DOUBAO_API_KEY,
      model: process.env.DOUBAO_MODEL || 'doubao-pro'
    }
  },
  voice: {
    whisper: {
      apiKey: process.env.OPENAI_API_KEY
    }
  }
};
