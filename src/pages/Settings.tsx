/**
 * 设置页(简化版)
 */
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export function Settings() {
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);
  const clearUser = useAppStore((s) => s.clearUser);

  function reset() {
    if (confirm('确定要清空所有进度吗?')) {
      clearUser();
      navigate('/');
      location.reload();
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-md mx-auto">
        <button onClick={() => navigate('/home')} className="btn-ghost mb-4">← 返回</button>
        <div className="card">
          <h2 className="text-2xl font-bold text-magic-700 mb-4">⚙️ 设置</h2>
          <div className="space-y-2 text-gray-700">
            <div>👤 名字:<span className="font-semibold">{user?.userName}</span></div>
            <div>🐣 Buddy:<span className="font-semibold">{user?.buddyName}</span></div>
            <div>📚 已读:<span className="font-semibold">{user?.completedStories.length ?? 0} 关</span></div>
            <div>⭐ 累计:<span className="font-semibold">{user?.totalStars ?? 0} 颗星</span></div>
          </div>
          <button onClick={reset} className="btn-ghost mt-6 w-full text-red-500">
            🗑 清空进度
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          Magic English MVP v0.1.0<br />
          基于 magic-english-buddy 思路
        </div>
      </div>
    </div>
  );
}
