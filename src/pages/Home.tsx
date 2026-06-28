/**
 * Home 关卡列表
 */
import { useNavigate } from 'react-router-dom';
import { stories } from '../data/stories';
import { useAppStore } from '../store/useAppStore';

export function Home() {
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);
  const isUnlocked = useAppStore((s) => s.isStoryUnlocked);
  const isCompleted = useAppStore((s) => s.isStoryCompleted);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        {/* 顶部用户信息 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-sm text-gray-500">欢迎回来</div>
            <div className="text-2xl font-bold text-magic-700">
              {user?.userName || '小魔法师'} 🧙
            </div>
            <div className="text-sm text-gray-500">
              Buddy:<span className="text-magic-600 font-semibold">{user?.buddyName || '小星星'}</span> · 
              ⭐ {user?.totalStars ?? 0} 颗星
            </div>
          </div>
          <button onClick={() => navigate('/settings')} className="btn-ghost">
            ⚙️
          </button>
        </div>

        {/* 关卡列表 */}
        <h2 className="text-xl font-bold text-gray-700 mb-3">📚 选择一关</h2>
        <div className="space-y-3">
          {stories.map((s, i) => {
            const unlocked = isUnlocked(s.id);
            const done = isCompleted(s.id);
            return (
              <button
                key={s.id}
                onClick={() => unlocked && navigate(`/reader/${s.id}`)}
                disabled={!unlocked}
                className={[
                  'card w-full text-left flex items-center gap-4 transition-all',
                  unlocked ? 'hover:scale-[1.02] cursor-pointer' : 'opacity-50 cursor-not-allowed',
                  done ? 'ring-2 ring-green-300' : '',
                ].join(' ')}
              >
                <div
                  className={[
                    'w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 bg-gradient-to-br',
                    s.themeColor,
                  ].join(' ')}
                >
                  {s.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-magic-600">第 {i + 1} 关</span>
                    {done && <span className="text-xs text-green-500">✓ 已完成</span>}
                    {!unlocked && <span className="text-xs text-gray-400">🔒 未解锁</span>}
                  </div>
                  <div className="text-lg font-bold text-gray-800">{s.titleCn}</div>
                  <div className="text-sm text-gray-500">{s.title}</div>
                </div>
                {unlocked && <div className="text-2xl text-magic-400">→</div>}
              </button>
            );
          })}
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          做完一关自动解锁下一关 💫
        </div>
      </div>
    </div>
  );
}
