/**
 * Quiz 答题页 — 4 题,2 种题型
 */
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStory } from '../data/stories';
import { ImageChoice } from '../components/quiz/ImageChoice';
import { WordBuilder } from '../components/quiz/WordBuilder';
import { Confetti } from '../components/Confetti';
import { playSuccess, playError } from '../utils/audio';
import { useAppStore } from '../store/useAppStore';

export function Quiz() {
  const { storyId = '' } = useParams();
  const navigate = useNavigate();
  const story = getStory(storyId);
  const completeStory = useAppStore((s) => s.completeStory);
  const unlockStory = useAppStore((s) => s.unlockStory);
  const stories_all = useAppStore.getState;

  const [qIdx, setQIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  if (!story) {
    return <div className="p-6 text-center">没找到题目 😢</div>;
  }

  const item = story.quiz[qIdx];
  const total = story.quiz.length;

  function handleAnswer(correct: boolean) {
    if (correct) {
      playSuccess();
      setCorrectCount((c) => c + 1);
    } else {
      playError();
    }

    if (qIdx < total - 1) {
      setTimeout(() => setQIdx((i) => i + 1), 1300);
    } else {
      setTimeout(() => {
        const final = correctCount + (correct ? 1 : 0);
        setCorrectCount(final);
        // 星数 = 答对题数
        completeStory(story!.id, final);
        // 解锁下一关
        const idx = ['story_1', 'story_2', 'story_3'].indexOf(story!.id);
        const next = ['story_1', 'story_2', 'story_3'][idx + 1];
        if (next) unlockStory(next);
        setDone(true);
      }, 1300);
    }
  }

  if (done) {
    const stars = correctCount;
    const allCorrect = stars === total;
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        {allCorrect && <Confetti />}
        <div className="card max-w-md w-full text-center">
          <div className="text-7xl mb-3">{allCorrect ? '🎉' : stars >= 2 ? '👏' : '💪'}</div>
          <h2 className="text-3xl font-bold text-magic-700 mb-2">
            {allCorrect ? '完美通关!' : '完成!'}
          </h2>
          <div className="text-lg text-gray-700 mb-4">
            答对 <span className="text-magic-600 font-bold text-2xl">{stars}</span> / {total} 题
          </div>
          <div className="text-4xl mb-4">
            {'⭐'.repeat(stars)}
            <span className="opacity-30">{'⭐'.repeat(total - stars)}</span>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => navigate('/home')} className="btn-magic w-full">
              🏠 回主页
            </button>
            <button onClick={() => navigate(`/reader/${storyId}`)} className="btn-ghost">
              ↺ 重读故事
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* 进度 */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="btn-ghost">←</button>
          <div className="text-sm text-gray-500">
            第 {qIdx + 1} / {total} 题
          </div>
          <div className="text-yellow-500">{'⭐'.repeat(correctCount)}</div>
        </div>

        {/* 进度条 */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-magic-400 to-pink-400 transition-all"
            style={{ width: `${((qIdx + 1) / total) * 100}%` }}
          />
        </div>

        {/* 题目 */}
        <div className="card">
          {item.type === 'image_choice' ? (
            <ImageChoice item={item} onAnswer={handleAnswer} />
          ) : (
            <WordBuilder item={item} onAnswer={handleAnswer} />
          )}
        </div>
      </div>
    </div>
  );
}
