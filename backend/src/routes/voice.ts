import { Router, Request, Response } from 'express';
import multer from 'multer';
import { transcribeAudio, synthesizeSpeech } from '../services/voice';

const router = Router();

// 配置 multer 用于文件上传
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 限制 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/m4a', 'audio/webm', 'audio/ogg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的音频格式'));
    }
  }
});

// 语音转文字
router.post('/transcribe', upload.single('audio'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: '请上传音频文件' });
    }

    const text = await transcribeAudio(req.file.buffer, req.file.originalname);
    
    res.json({ success: true, text });
  } catch (error) {
    console.error('语音识别失败:', error);
    res.status(500).json({ success: false, error: '语音识别失败' });
  }
});

// 文字转语音
router.post('/synthesize', async (req: Request, res: Response) => {
  try {
    const { text, voice = 'alloy' } = req.body;
    
    if (!text) {
      return res.status(400).json({ success: false, error: '请输入文本内容' });
    }

    const audioBuffer = await synthesizeSpeech(text, voice);
    
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length.toString()
    });
    
    res.send(audioBuffer);
  } catch (error) {
    console.error('语音合成失败:', error);
    res.status(500).json({ success: false, error: '语音合成失败' });
  }
});

export default router;
