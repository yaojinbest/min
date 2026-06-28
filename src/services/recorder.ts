/**
 * 录音服务 — MediaRecorder 封装
 * 跟读用,只录一段
 */

class RecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private stream: MediaStream | null = null;

  isSupported(): boolean {
    return typeof navigator !== 'undefined' && !!navigator.mediaDevices && !!window.MediaRecorder;
  }

  async start(): Promise<void> {
    if (!this.isSupported()) throw new Error('Recorder not supported');
    this.chunks = [];
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(this.stream);
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data);
    };
    this.mediaRecorder.start();
  }

  stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: 'audio/webm' });
        this.cleanup();
        resolve(blob);
      };
      this.mediaRecorder.onerror = (e) => {
        this.cleanup();
        reject(e);
      };
      this.mediaRecorder.stop();
    });
  }

  private cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
  }

  get recording() {
    return this.mediaRecorder?.state === 'recording';
  }
}

export const recorder = new RecorderService();
