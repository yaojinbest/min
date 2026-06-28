/**
 * 图选题:4 个 emoji 选项,选对应单词
 * 核心:大喇叭按钮 + 自动播放一次 answer
 */
import { useState, useEffect, useRef } from 'react';
import type { QuizItem } from '../../data/stories';
import { tts } from '../../services/tts';

interface Props {
  item: QuizItem;
  onAnswer: (correct: boolean) => void;
}

export function ImageChoice({ item, onAnswer }: Props) {
  const [picked, setPicked] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [playing, setPlaying] = useState(false);
  const playedRef = useRef(false);

  // 切换题目时重置状态 + 自动播一次 answer
  useEffect(() => {
    setPicked(null);
    setShowResult(false);
    playedRef.current = false;

    // 等 500ms 再播,让用户先看清题目
    const timer = setTimeout(() => {
      if (tts.isSupported() && !playedRef.current) {
        playedRef.current = true;
        // 如果还没 primed,只在 console 提醒(用户点选项时才 prime)
        if (!tts.isPrimed()) {
          console.log('[ImageChoice] waiting for first user gesture to prime TTS');
        }
        playAnswer();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [item.id]);

  async function playAnswer() {
    if (!tts.isSupported()) {
      alert('当前浏览器不支持语音朗读 😅\n\n推荐用 Chrome / Edge / Safari 最新版');
      return;
    }
    setPlaying(true);
    await tts.ready();
    try {
      await tts.speak(item.answer);
    } finally {
      setPlaying(false);
    }
  }

  function pick(value: string) {
    if (showResult) return;
    setPicked(value);
    setShowResult(true);
    const correct = value === item.answer;
    setTimeout(() => onAnswer(correct), 1200);
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-center mb-4 text-magic-700">
        {item.question}
      </h3>

      {/* 🔊 大喇叭按钮 — 显眼的"听一听"入口 */}
      <div className="flex justify-center mb-6">
        <button
          onClick={playAnswer}
          disabled={playing}
          className={[
            'px-8 py-4 rounded-3xl font-bold text-lg shadow-lg',
            'flex items-center gap-3 transition-all',
            'bg-gradient-to-r from-magic-500 to-pink-500 text-white',
            playing ? 'animate-pulse scale-95' : 'hover:scale-105 active:scale-95',
          ].join(' ')}
        >
          <span className="text-3xl">🔊</span>
          <span>{playing ? '播放中...' : '点我听单词'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {item.options?.map((opt) => {
          const isPicked = picked === opt.value;
          const isCorrect = opt.value === item.answer;
          let cls = 'card cursor-pointer hover:scale-105 transition-all';
          if (showResult && isPicked) {
            cls += isCorrect ? ' ring-4 ring-green-400 bg-green-50' : ' ring-4 ring-red-400 bg-red-50';
          } else if (showResult && isCorrect && !isPicked) {
            cls += ' ring-4 ring-green-400 bg-green-50';
          }
          return (
            <button key={opt.value} className={cls} onClick={() => pick(opt.value)}>
              <div className="text-6xl mb-2">{opt.emoji}</div>
              <div className="text-sm text-gray-600">{opt.value}</div>
            </button>
          );
        })}
      </div>

      {/* 调试入口 */}
      <div
        className="mt-6 text-center text-xs text-gray-300 cursor-help"
        onDoubleClick={() => {
          console.log('[TTS] diagnose:', tts.diagnose());
          alert(JSON.stringify(tts.diagnose(), null, 2));
        }}
      >
        💡 没听到声音?双击这里看诊断
      </div>
    </div>
  );
}