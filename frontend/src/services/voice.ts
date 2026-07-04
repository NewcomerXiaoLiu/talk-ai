const API_BASE = '/api/voice';

// 语音转文字
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');

  const response = await fetch(`${API_BASE}/transcribe`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('语音识别失败');
  }

  const data = await response.json();
  return data.text;
}

// 文字转语音
export async function synthesizeSpeech(text: string, voice: string = '冰糖'): Promise<string> {
  const response = await fetch(`${API_BASE}/synthesize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text, voice })
  });

  if (!response.ok) {
    throw new Error('语音合成失败');
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
