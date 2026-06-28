/**
 * App 路由
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { Reader } from './pages/Reader';
import { Quiz } from './pages/Quiz';
import { Settings } from './pages/Settings';
import { useAppStore } from './store/useAppStore';

export default function App() {
  const user = useAppStore((s) => s.user);
  const hasUser = !!user?.userName;

  return (
    <Routes>
      <Route path="/" element={hasUser ? <Navigate to="/home" /> : <Onboarding />} />
      <Route path="/home" element={hasUser ? <Home /> : <Navigate to="/" />} />
      <Route path="/reader/:storyId" element={hasUser ? <Reader /> : <Navigate to="/" />} />
      <Route path="/quiz/:storyId" element={hasUser ? <Quiz /> : <Navigate to="/" />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
