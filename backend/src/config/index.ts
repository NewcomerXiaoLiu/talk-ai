import dotenv from 'dotenv';

dotenv.config();

export default {
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  ai: {
    provider: process.env.AI_PROVIDER || 'mimo',
    mimo: {
      apiKey: process.env.MIMO_API_KEY || '',
      baseUrl: process.env.MIMO_BASE_URL || 'https://api.mimo.ai',
      model: process.env.MIMO_MODEL || 'mimo-v2.5'
    },
    doubao: {
      apiKey: process.env.DOUBAO_API_KEY || '',
      model: process.env.DOUBAO_MODEL || 'doubao-pro'
    }
  },
  voice: {
    apiKey: process.env.MIMO_API_KEY || '',
    defaultVoice: process.env.MIMO_DEFAULT_VOICE || '冰糖'
  }
};
