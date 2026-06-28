/**
 * 图选题:4 个 emoji 选项,选对应单词
 */
import { useState, useEffect } from 'react';
import type { QuizItem } from '../../data/stories';

interface Props {
  item: QuizItem;
  onAnswer: (correct: boolean) => void;
}

export function ImageChoice({ item, onAnswer }: Props) {
  const [picked, setPicked] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  // 切换题目时重置状态
  useEffect(() => {
    setPicked(null);
    setShowResult(false);
  }, [item.id]);

  function pick(value: string) {
    if (showResult) return;
    setPicked(value);
    setShowResult(true);
    const correct = value === item.answer;
    setTimeout(() => onAnswer(correct), 1200);
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-center mb-6 text-magic-700">
        {item.question}
      </h3>
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
    </div>
  );
}
