/**
 * TTS 服务 — Web Speech API 封装
 * 单词级别高亮(基于 onboundary 事件)
 */

export interface TTSOptions {
  rate?: number;
  lang?: string;
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

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  isSupported(): boolean {
    return this.synthesis !== null;
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
    const tokens = text.split(/(\s+)/);
    const words: { word: string; start: number; end: number }[] = [];
    let charIndex = 0;
    for (const t of tokens) {
      if (t.trim() && /[a-zA-Z]/.test(t)) {
        words.push({
          word: t.replace(/[^a-zA-Z]/g, ''),
          start: charIndex,
          end: charIndex + t.length,
        });
      }
      charIndex += t.length;
    }
    return words;
  }

  speak(text: string, options: TTSOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('TTS not supported'));
        return;
      }
      this.stop();

      const words = this.parseWords(text);
      const u = new SpeechSynthesisUtterance(text);
      u.rate = options.rate ?? this.currentRate;
      u.lang = options.lang ?? this.currentLang;
      u.pitch = 1.1; // 童声感

      // 优选 en-US 语音
      const voices = this.synthesis.getVoices();
      const preferred = voices.find((v) => v.lang === 'en-US' && v.localService) ||
        voices.find((v) => v.lang === 'en-US') ||
        voices.find((v) => v.lang.startsWith('en'));
      if (preferred) u.voice = preferred;

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
        this.isPlaying = false;
        this.emit({ type: 'error', error: e.error });
        resolve(); // 不 reject,避免 unhandled
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
      this.synthesis.speak(u);
    });
  }

  stop() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.isPlaying = false;
    }
  }

  get playing() {
    return this.isPlaying;
  }
}

export const tts = new TTSService();
