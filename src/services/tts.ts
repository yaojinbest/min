/**
 * TTS 服务 — Web Speech API 封装(修复版)
 *
 * 已知坑:
 * 1. voices 异步加载,首次 getVoices() 返回空数组 → 必须等 voiceschanged
 * 2. Chrome 短文本(< 1s)经常被吞音,utterance.volume=1 + 加短停顿
 * 3. iOS Safari 必须在用户手势内 new utterance,否则无效
 * 4. 长文本一次性 speak 有 bug,要分段
 * 5. 必须先 cancel() 再 speak,否则会排队不响
 * 6. onboundary 在 Chrome 默认不开,需 charIndex + boundary 监听
 */

export interface TTSOptions {
  rate?: number;
  lang?: string;
  pitch?: number;
}

type TTSEvent =
  | { type: 'start' }
  | { type: 'end' }
  | { type: 'word'; wordIndex: number; word: string }
  | { type: 'error'; error: string };

class TTSService {
  private synthesis: SpeechSynthesis | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;
  private isPlaying = false;
  private listeners: Set<(e: TTSEvent) => void> = new Set();
  private currentRate = 0.9;
  private currentLang = 'en-US';
  private currentPitch = 1.1;
  private voicesReady = false;
  private voicesReadyPromise: Promise<void> | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      this.initVoices();
    }
  }

  isSupported(): boolean {
    return this.synthesis !== null;
  }

  /** 异步等 voices 加载完(Gecko/Chrome 必须) */
  private initVoices(): Promise<void> {
    if (this.voicesReady) return Promise.resolve();
    if (this.voicesReadyPromise) return this.voicesReadyPromise;

    this.voicesReadyPromise = new Promise((resolve) => {
      if (!this.synthesis) {
        resolve();
        return;
      }
      const handle = () => {
        if (this.synthesis && this.synthesis.getVoices().length > 0) {
          this.voicesReady = true;
          this.synthesis.removeEventListener('voiceschanged', handle);
          resolve();
        }
      };
      // 立即尝试一次
      if (this.synthesis.getVoices().length > 0) {
        this.voicesReady = true;
        resolve();
        return;
      }
      // 等异步加载
      this.synthesis.addEventListener('voiceschanged', handle);
      // 兜底:5 秒后强行 resolve(部分浏览器不发 voiceschanged)
      setTimeout(() => {
        if (!this.voicesReady) {
          console.warn('[TTS] voiceschanged timeout, fallback to any voice');
          this.voicesReady = true;
          this.synthesis?.removeEventListener('voiceschanged', handle);
          resolve();
        }
      }, 5000);
    });

    return this.voicesReadyPromise;
  }

  /** 等 voices 加载好再 speak */
  async ready(): Promise<void> {
    return this.initVoices();
  }

  setRate(rate: number) {
    this.currentRate = Math.max(0.5, Math.min(1.5, rate));
  }

  subscribe(cb: (e: TTSEvent) => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private emit(e: TTSEvent) {
    this.listeners.forEach((cb) => cb(e));
  }

  /** 解析句子的单词边界 */
  private parseWords(text: string): { word: string; start: number; end: number }[] {
    const words: { word: string; start: number; end: number }[] = [];
    let i = 0;
    while (i < text.length) {
      if (/[a-zA-Z']/.test(text[i])) {
        let j = i;
        while (j < text.length && /[a-zA-Z']/.test(text[j])) j++;
        words.push({
          word: text.slice(i, j),
          start: i,
          end: j,
        });
        i = j;
      } else {
        i++;
      }
    }
    return words;
  }

  /** 选最佳英语语音 */
  private pickVoice(): SpeechSynthesisVoice | null {
    if (!this.synthesis) return null;
    const voices = this.synthesis.getVoices();
    if (voices.length === 0) return null;

    // 优先级:en-US 本地 > en-US 任意 > en-GB > en-* 任意 > 默认
    return (
      voices.find((v) => v.lang === 'en-US' && v.localService) ||
      voices.find((v) => v.lang === 'en-US') ||
      voices.find((v) => v.lang === 'en-GB') ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0]
    );
  }

  speak(text: string, options: TTSOptions = {}): Promise<void> {
    return new Promise(async (resolve) => {
      if (!this.synthesis) {
        this.emit({ type: 'error', error: 'not-supported' });
        resolve();
        return;
      }

      // 先 cancel,避免排队
      this.synthesis.cancel();
      // 关键:Chrome cancel 后需要等待,否则下个 speak 被吞
      await new Promise((r) => setTimeout(r, 50));

      // 等 voices 加载
      await this.ready();

      const words = this.parseWords(text);
      const u = new SpeechSynthesisUtterance(text);
      u.rate = options.rate ?? this.currentRate;
      u.lang = options.lang ?? this.currentLang;
      u.pitch = options.pitch ?? this.currentPitch;
      u.volume = 1; // 显式设最大

      const voice = this.pickVoice();
      if (voice) {
        u.voice = voice;
        u.lang = voice.lang; // 用 voice 的 lang,避免不匹配
      }

      u.onstart = () => {
        this.isPlaying = true;
        this.emit({ type: 'start' });
      };
      u.onend = () => {
        this.isPlaying = false;
        this.emit({ type: 'end' });
        resolve();
      };
      u.onerror = (e) => {
        // 'canceled' / 'interrupted' 不算错
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.error('[TTS] error:', e.error);
          this.emit({ type: 'error', error: e.error });
        }
        this.isPlaying = false;
        this.emit({ type: 'end' });
        resolve();
      };
      u.onboundary = (e) => {
        if (e.name === 'word') {
          const charIdx = e.charIndex;
          const w = words.find((w) => charIdx >= w.start && charIdx < w.end);
          if (w) {
            this.emit({ type: 'word', wordIndex: words.indexOf(w), word: w.word });
          }
        }
      };

      this.utterance = u;
      try {
        this.synthesis.speak(u);
      } catch (err) {
        console.error('[TTS] speak threw:', err);
        this.emit({ type: 'error', error: String(err) });
        this.isPlaying = false;
        resolve();
      }
    });
  }

  stop() {
    if (this.synthesis) {
      try {
        this.synthesis.cancel();
      } catch {}
      this.isPlaying = false;
    }
  }

  get playing() {
    return this.isPlaying;
  }

  /** 诊断:返回当前 TTS 状态(调试用) */
  diagnose(): object {
    if (!this.synthesis) return { supported: false };
    return {
      supported: true,
      voicesReady: this.voicesReady,
      voiceCount: this.synthesis.getVoices().length,
      voices: this.synthesis.getVoices().slice(0, 5).map((v) => `${v.name} (${v.lang})`),
      speaking: this.synthesis.speaking,
      pending: this.synthesis.pending,
      paused: this.synthesis.paused,
    };
  }
}

export const tts = new TTSService();

// 暴露到 window 方便调试
if (typeof window !== 'undefined') {
  (window as any).__tts = tts;
}