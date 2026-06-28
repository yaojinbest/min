/**
 * 拼词题:点击字母顺序拼单词
 */
import { useState } from 'react';
import type { QuizItem } from '../../data/stories';

interface Props {
  item: QuizItem;
  onAnswer: (correct: boolean) => void;
}

export function WordBuilder({ item, onAnswer }: Props) {
  const [picked, setPicked] = useState<number[]>([]);
  const [pool, setPool] = useState<number[]>(
    item.scrambled.map((_, i) => i).sort(() => Math.random() - 0.5),
  );
  const [showResult, setShowResult] = useState(false);

  const built = picked.map((i) => item.scrambled[i]).join('');

  function addLetter(idx: number) {
    if (showResult) return;
    setPicked([...picked, idx]);
    setPool(pool.filter((i) => i !== idx));
  }

  function removeLetter(pos: number) {
    if (showResult) return;
    const idx = picked[pos];
    setPicked(picked.filter((_, i) => i !== pos));
    setPool([...pool, idx].sort((a, b) => a - b));
  }

  function submit() {
    if (picked.length !== item.scrambled.length) return;
    setShowResult(true);
    const correct = built.toLowerCase() === item.answer.toLowerCase();
    setTimeout(() => onAnswer(correct), 1200);
  }

  function reset() {
    if (showResult) return;
    setPicked([]);
    setPool(item.scrambled.map((_, i) => i).sort(() => Math.random() - 0.5));
  }

  const isFull = picked.length === item.scrambled.length;
  const isCorrect = built.toLowerCase() === item.answer.toLowerCase();

  return (
    <div>
      <h3 className="text-xl font-bold text-center mb-6 text-magic-700">
        {item.question}
      </h3>

      {/* 已选字母 */}
      <div className="flex justify-center gap-2 mb-6 min-h-[60px] items-center">
        {picked.length === 0 && <div className="text-gray-400 text-sm">点击下方字母拼出单词</div>}
        {picked.map((idx, pos) => {
          const ch = item.scrambled[idx];
          const correctChar = isFull && isCorrect;
          const wrongChar = isFull && !isCorrect;
          return (
            <button
              key={pos}
              onClick={() => removeLetter(pos)}
              className={[
                'w-12 h-14 rounded-xl text-2xl font-bold shadow transition-all',
                correctChar ? 'bg-green-400 text-white' : wrongChar ? 'bg-red-400 text-white' : 'bg-magic-200 text-magic-800 hover:scale-110',
              ].join(' ')}
            >
              {ch}
            </button>
          );
        })}
      </div>

      {/* 字母池 */}
      <div className="flex justify-center gap-2 flex-wrap mb-4">
        {pool.map((idx) => (
          <button
            key={idx}
            onClick={() => addLetter(idx)}
            className="w-12 h-12 rounded-xl bg-white text-magic-700 text-xl font-bold shadow hover:scale-110 active:scale-95 transition-all"
          >
            {item.scrambled[idx]}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-2">
        <button onClick={reset} className="btn-ghost">↺ 重来</button>
        <button
          onClick={submit}
          disabled={!isFull}
          className="btn-magic disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ✓ 提交
        </button>
      </div>

      {showResult && !isCorrect && (
        <div className="mt-4 text-center text-green-600 font-semibold">
          正确答案:<span className="text-2xl ml-2">{item.answer}</span>
        </div>
      )}
    </div>
  );
}
