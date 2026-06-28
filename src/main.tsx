import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { tts } from './services/tts';
import './index.css';

// ===== 解决 Chrome Autoplay Policy =====
// 首次 speak 必须在 user gesture 里调用,否则被静默拒绝
// 这里监听页面首次任意点击/触摸/按键,在那一刻调用 prime()
// 后续所有 speak() 就能正常工作(包括 useEffect 自动播放)
function primeOnFirstGesture() {
  const ok = tts.prime();
  if (ok) {
    // 成功后移除所有监听
    window.removeEventListener('click', primeOnFirstGesture, true);
    window.removeEventListener('touchstart', primeOnFirstGesture, true);
    window.removeEventListener('keydown', primeOnFirstGesture, true);
    window.removeEventListener('pointerdown', primeOnFirstGesture, true);
  }
}
window.addEventListener('click', primeOnFirstGesture, true);
window.addEventListener('touchstart', primeOnFirstGesture, true);
window.addEventListener('keydown', primeOnFirstGesture, true);
window.addEventListener('pointerdown', primeOnFirstGesture, true);
// ===== End autoplay fix =====

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);