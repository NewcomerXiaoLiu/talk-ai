import config from '../config';

// 语音识别（STT）- 使用 Whisper API
export async function transcribeAudio(audioBuffer: Buffer, fileName: string): Promise<string> {
  const apiKey = config.voice.whisper.apiKey;
  
  if (!apiKey) {
    throw new Error('未配置 Whisper API Key');
  }

  // 将 Buffer 转换为 Blob
  const blob = new Blob([new Uint8Array(audioBuffer)], { type: 'audio/wav' });
  
  // 创建 FormData
  const formData = new FormData();
  formData.append('file', blob, fileName);
  formData.append('model', 'whisper-1');
  formData.append('language', 'zh');
  formData.append('response_format', 'json');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error(`语音识别失败: ${response.status}`);
  }

  const data: any = await response.json();
  return data.text;
}

// 语音合成（TTS）- 使用 OpenAI TTS API
export async function synthesizeSpeech(text: string, voice: string = 'alloy'): Promise<Buffer> {
  const apiKey = config.voice.whisper.apiKey;
  
  if (!apiKey) {
    throw new Error('未配置 TTS API Key');
  }

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: text,
      voice: voice,
      response_format: 'mp3'
    })
  });

  if (!response.ok) {
    throw new Error(`语音合成失败: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
