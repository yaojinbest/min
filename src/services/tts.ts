/**
 * TTS 服务 v2 — 基于预录真人发音 (Edge TTS 生成)
 *
 * 优势:
 * - 100% 浏览器兼容,无 autoplay policy 问题
 * - 高质量 AriaNeural 真人发音
 * - 单词边界高亮用音频时长/词数估算
 *
 * 文件结构(public/audio/):
 *   - {word}.mp3(50 个词典词)
 *   - story_{n}_p{m}.mp3(3 故事 × 3 段 = 9 个)
 *   - durations.json(60 个时长数据)
 */

import durationsData from '../../public/audio/durations.json';

export interface TTSOptions {
  rate?: number; // 0.5 - 1.5
}

type TTSEvent =
  | { type: 'start' }
  | { type: 'end' }
  | { type: 'word'; wordIndex: number; word: string }
  | { type: 'error'; error: string };

// 预加载时长数据
const durations: Record<string, number> = durationsData as any;

class AudioTTSService {
  private audio: HTMLAudioElement | null = null;
  private listeners: Set<(e: TTSEvent) => void> = new Set();
  private isPlaying = false;
  private currentText = '';
  private currentWords: string[] = [];
  private rafId: number | null = null;

  /** 获取音频 URL(单词) */
  private wordUrl(word: string): string {
    const safe = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `./audio/${safe}.mp3`;
  }

  /** 段落 URL(story_X_pY) */
  paragraphUrl(storyId: string, pIdx: number): string {
    const n = storyId.replace('story_', '');
    return `./audio/story_${n}_p${pIdx + 1}.mp3`;
  }

  /** 获取时长(秒) */
  getDuration(name: string): number {
    return durations[name] || 1.5;
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && typeof Audio !== 'undefined';
  }

  subscribe(cb: (e: TTSEvent) => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private emit(e: TTSEvent) {
    this.listeners.forEach((cb) => cb(e));
  }

  /**
   * 播放单词
   * 单个 mp3,无需分段,自动播放有 Chrome autoplay 限制所以仍是 user gesture
   */
  async speakWord(word: string): Promise<void> {
    return this.playAudio(this.wordUrl(word), word, [word]);
  }

  /**
   * 播放整句(用预录的段落音频)
   */
  async speakParagraph(storyId: string, pIdx: number, text: string): Promise<void> {
    const url = this.paragraphUrl(storyId, pIdx);
    const words = text.split(/\s+/).filter((w) => /[a-zA-Z]/.test(w));
    return this.playAudio(url, text, words);
  }

  /**
   * 核心播放:单个音频文件 + 高亮估算
   */
  private async playAudio(url: string, text: string, words: string[]): Promise<void> {
    if (!this.isSupported()) {
      this.emit({ type: 'error', error: 'not-supported' });
      return;
    }

    this.stop();
    this.currentText = text;
    this.currentWords = words;

    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      this.audio = audio;

      audio.oncanplaythrough = () => {
        // 可以播了
      };

      audio.onplay = () => {
        this.isPlaying = true;
        this.emit({ type: 'start' });
        this.startWordHighlight(audio, words);
      };

      audio.onended = () => {
        this.isPlaying = false;
        this.stopWordHighlight();
        this.emit({ type: 'end' });
        resolve();
      };

      audio.onerror = (e) => {
        this.isPlaying = false;
        this.stopWordHighlight();
        console.error('[AudioTTS] load/play error:', url, e);
        this.emit({ type: 'error', error: 'load-failed' });
        resolve();
      };

      // Chrome autoplay:必须在 user gesture 内首次 play
      audio.play().catch((err) => {
        console.error('[AudioTTS] play() rejected:', err);
        this.emit({ type: 'error', error: 'autoplay-blocked' });
        resolve();
      });
    });
  }

  /**
   * 单词高亮:按音节权重计算每个词的时间区间,实时高亮
   * 原理:单词发音时长 ∝ 音节数。多个单词的相对时长加起来 = 100%
   * - 单音节词: 0.8 (I, a, is, am)
   * - 双音节词: 1.5 (magic, dragon, happy)
   * - 三音节词+: 2.2
   */
  private getWordWeights(words: string[]): number[] {
    return words.map((w) => {
      const clean = w.toLowerCase().replace(/[^a-z]/g, '');
      // 元音组数 = 音节数(粗估)
      const syllables = (clean.match(/[aeiouy]+/g) || ['a']).length;
      // 长词加点权重
      const len = clean.length;
      const weight = syllables * 0.7 + (len > 5 ? 0.3 : 0);
      return Math.max(0.6, weight);
    });
  }

  /**
   * 计算每个词的累计时间点(秒)
   * 返回数组:boundaries[i] = 词 i 的开始时间
   */
  private computeBoundaries(words: string[], duration: number): number[] {
    const weights = this.getWordWeights(words);
    const total = weights.reduce((s, w) => s + w, 0);
    const boundaries: number[] = [0];
    let acc = 0;
    for (let i = 0; i < weights.length - 1; i++) {
      acc += weights[i];
      boundaries.push((acc / total) * duration);
    }
    return boundaries;
  }

  /**
   * 单词高亮:基于音节权重 + audio.currentTime 精确跟踪
   */
  private startWordHighlight(audio: HTMLAudioElement, words: string[]) {
    this.stopWordHighlight();
    if (words.length === 0) return;

    const tick = () => {
      if (!this.isPlaying || !audio.duration) {
        return;
      }
      const t = audio.currentTime;
      const dur = audio.duration;

      // 方案 1: 只有一个词,不计算高亮
      if (words.length === 1) {
        this.emit({ type: 'word', wordIndex: 0, word: words[0] });
        this.rafId = requestAnimationFrame(tick);
        return;
      }

      // 方案 2: 多个词,按音节权重算当前词
      const boundaries = this.computeBoundaries(words, dur);
      let idx = 0;
      for (let i = boundaries.length - 1; i >= 0; i--) {
        if (t >= boundaries[i]) {
          idx = i;
          break;
        }
      }
      this.emit({ type: 'word', wordIndex: idx, word: words[idx] });
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private stopWordHighlight() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  stop() {
    this.stopWordHighlight();
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.currentTime = 0;
      } catch {}
      this.audio = null;
    }
    this.isPlaying = false;
  }

  get playing() {
    return this.isPlaying;
  }

  /** 预热:加载词典音频到浏览器缓存(下次播立即响应) */
  prime() {
    if (typeof window === 'undefined') return;
    // 只预热高频词 + 段落
    const toPrime = ['egg', 'magic', 'dragon', 'star', 'i', 'you', 'look', 'see'];
    toPrime.forEach((w) => {
      const a = new Audio();
      a.preload = 'auto';
      a.src = this.wordUrl(w);
    });
    // 段落音频
    for (let s = 1; s <= 3; s++) {
      for (let p = 1; p <= 3; p++) {
        const a = new Audio();
        a.preload = 'auto';
        a.src = `./audio/story_${s}_p${p}.mp3`;
      }
    }
    console.log('[AudioTTS] primed');
  }

  /** 诊断 */
  diagnose(): object {
    return {
      supported: this.isSupported(),
      playing: this.isPlaying,
      currentAudio: this.audio?.src || null,
      durationsLoaded: Object.keys(durations).length,
    };
  }
}

export const tts = new AudioTTSService();

if (typeof window !== 'undefined') {
  (window as any).__tts = tts;
}