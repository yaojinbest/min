/**
 * 录音跟读组件 v0.2.3
 * 录 → 回放(对比)→ 重新录
 *
 * v0.2.3 修复:
 * - 翻页时彻底清理所有录音相关状态
 * - 录音中翻页强制 stop recorder
 * - 卸载时清理 blob URL(避免内存泄漏)
 */
import { useState, useRef, useEffect } from 'react';
import { recorder } from '../services/recorder';
import { playClick } from '../utils/audio';

interface Props {
  text: string; // 要跟读的文本
  onPlayTTS: () => void; // 播放 TTS(先听后读)
  ttsPlaying?: boolean;
}

export function Recorder({ text, onPlayTTS, ttsPlaying }: Props) {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);

  // === 关键修复:监听 text 变化,完全清理录音状态 ===
  useEffect(() => {
    // 1. 卸载 audio 元素
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.src = '';
      } catch {}
      audioRef.current = null;
    }
    // 2. 释放 blob URL
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    // 3. 强制停止进行中的录音
    if (recorder.recording) {
      recorder.stop().catch(() => {});
    }
    // 4. 清空所有 state
    setAudioUrl(null);
    setError(null);
    setRecording(false);
  }, [text]);

  // 卸载时最后清理
  useEffect(() => {
    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
      }
      if (recorder.recording) {
        recorder.stop().catch(() => {});
      }
    };
  }, []);

  async function startRec() {
    setError(null);
    // 开始新录音前清掉旧的
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setAudioUrl(null);
    try {
      await recorder.start();
      setRecording(true);
      playClick();
    } catch (e: any) {
      setError('需要麦克风权限才能跟读哦');
    }
  }

  async function stopRec() {
    try {
      const blob = await recorder.stop();
      // 释放上一个
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      setAudioUrl(url);
      setRecording(false);
    } catch (e: any) {
      setError('录音失败,请重试');
      setRecording(false);
    }
  }

  function playMyVoice() {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  }

  // === 关键修复:如果正在录音,翻页前强制停止 ===
  function stopBeforeLeave() {
    if (recording) {
      stopRec();
    }
  }

  return (
    <div className="card">
      <div className="text-sm text-gray-500 mb-2 text-center">
        🎙️ 跟读练习 <span className="text-xs text-magic-400">(v0.2.3)</span>
      </div>
      <div className="text-center text-lg mb-4 italic text-magic-700" key={text}>
        "{text}"
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={onPlayTTS}
          disabled={ttsPlaying}
          className="btn-ghost disabled:opacity-50"
        >
          🔊 听原声
        </button>

        {!recording ? (
          <button onClick={startRec} className="btn-magic">
            🎤 开始跟读
          </button>
        ) : (
          <button
            onClick={stopRec}
            className="px-6 py-3 rounded-2xl bg-red-500 text-white font-bold text-lg shadow-lg animate-pulse"
          >
            ⏹ 停止
          </button>
        )}
      </div>

      {error && (
        <div className="mt-3 text-sm text-red-500 text-center">{error}</div>
      )}

      {/* === 关键修复:用 key 强制 audio 元素在 text 变化时重建 === */}
      {audioUrl && (
        <div className="mt-4 text-center" key={`audio-${text}`}>
          <div className="text-sm text-green-600 mb-2">✓ 录好了!对比一下:</div>
          <audio
            key={`audio-el-${text}-${audioUrl}`}
            ref={audioRef}
            src={audioUrl}
            controls
            className="w-full"
          />
          <button onClick={playMyVoice} className="btn-ghost mt-2">
            ▶ 播放我的
          </button>
        </div>
      )}
    </div>
  );
}