/**
 * 创号页 — 选名字 + Buddy 名
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export function Onboarding() {
  const navigate = useNavigate();
  const setUser = useAppStore((s) => s.setUser);
  const [name, setName] = useState('');
  const [buddyName, setBuddyName] = useState('小星星');

  function start() {
    if (!name.trim()) return;
    setUser(name.trim(), buddyName.trim() || '小星星');
    navigate('/home');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card max-w-md w-full">
        <div className="text-6xl text-center mb-2">🧙‍♂️✨</div>
        <h1 className="text-3xl font-bold text-center text-magic-700 mb-1">
          魔法英语
        </h1>
        <p className="text-center text-gray-500 mb-6">Magic English · 6-12 岁</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              你的名字 👋
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="比如:小明"
              className="w-full px-4 py-3 rounded-xl border-2 border-magic-200 focus:border-magic-500 outline-none text-lg"
              maxLength={10}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              你的魔法伙伴叫什么?🐣
            </label>
            <input
              value={buddyName}
              onChange={(e) => setBuddyName(e.target.value)}
              placeholder="比如:小星星"
              className="w-full px-4 py-3 rounded-xl border-2 border-magic-200 focus:border-magic-500 outline-none text-lg"
              maxLength={10}
            />
          </div>

          <button
            onClick={start}
            disabled={!name.trim()}
            className="btn-magic w-full disabled:opacity-40"
          >
            🚀 开始冒险
          </button>
        </div>
      </div>
    </div>
  );
}
