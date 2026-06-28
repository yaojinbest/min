/**
 * 录音跟读组件
 * 录 → 回放(对比)→ 重新录
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
  const urlRef = useRef<string | null>(null); // 记录最新 URL,卸载时释放

  // 切换段落(text 变化)时重置状态 + 释放上一个 blob URL
  useEffect(() => {
    // 卸载当前 audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    // 释放上一个 blob URL
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setAudioUrl(null);
    setError(null);
    setRecording(false);
  }, [text]);

  // 组件卸载时彻底清理
  useEffect(() => {
    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
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

  return (
    <div className="card">
      <div className="text-sm text-gray-500 mb-2 text-center">🎙️ 跟读练习 (v0.2.0)</div>
      <div className="text-center text-lg mb-4 italic text-magic-700" data-testid="recorder-text">
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

      {audioUrl && (
        <div className="mt-4 text-center">
          <div className="text-sm text-green-600 mb-2">✓ 录好了!对比一下:</div>
          <audio ref={audioRef} src={audioUrl} controls className="w-full" />
          <button onClick={playMyVoice} className="btn-ghost mt-2">
            ▶ 播放我的
          </button>
        </div>
      )}
    </div>
  );
}