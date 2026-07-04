import config from '../config';

// 语音识别（ASR）- 使用 MiMo ASR
export async function transcribeAudio(audioBuffer: Buffer, fileName: string): Promise<string> {
  const apiKey = config.voice.apiKey;
  const baseUrl = config.ai.mimo.baseUrl;

  if (!apiKey) {
    throw new Error('未配置 MiMo API Key');
  }

  // 检测 MIME 类型
  const ext = fileName.split('.').pop()?.toLowerCase() || 'wav';
  const mimeType = ext === 'mp3' ? 'audio/mpeg' : 'audio/wav';

  // Base64 编码
  const audioBase64 = audioBuffer.toString('base64');
  const dataUrl = `data:${mimeType};base64,${audioBase64}`;

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'mimo-v2.5-asr',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'input_audio',
              input_audio: {
                data: dataUrl
              }
            }
          ]
        }
      ],
      asr_options: {
        language: 'zh'
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`语音识别失败: ${response.status} - ${error}`);
  }

  const data: any = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// 语音合成（TTS）- 使用 MiMo TTS
export async function synthesizeSpeech(text: string, voice: string = '冰糖'): Promise<Buffer> {
  const apiKey = config.voice.apiKey;
  const baseUrl = config.ai.mimo.baseUrl;

  if (!apiKey) {
    throw new Error('未配置 MiMo API Key');
  }

  console.log('TTS 请求:', { baseUrl, text: text.substring(0, 50), voice });

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'mimo-v2.5-tts',
      messages: [
        {
          role: 'user',
          content: ''
        },
        {
          role: 'assistant',
          content: text
        }
      ],
      audio: {
        format: 'wav',
        voice: voice
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('TTS API 错误:', response.status, error);
    throw new Error(`语音合成失败: ${response.status} - ${error}`);
  }

  const data: any = await response.json();
  console.log('TTS 响应:', { hasAudio: !!data.choices?.[0]?.message?.audio?.data });
  const audioData = data.choices?.[0]?.message?.audio?.data;

  if (!audioData) {
    throw new Error('语音合成返回数据为空');
  }

  // Base64 解码为 Buffer
  return Buffer.from(audioData, 'base64');
}
