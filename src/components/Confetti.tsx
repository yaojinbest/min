/**
 * 撒花效果(canvas-confetti 包装)
 */
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export function Confetti() {
  useEffect(() => {
    // 两次喷射
    const fire = (particleRatio: number, opts: any) => {
      confetti({
        origin: { y: 0.7 },
        ...opts,
        particleCount: Math.floor(200 * particleRatio),
      });
    };

    fire(0.25, { spread: 26, startVelocity: 55, colors: ['#a855f7', '#ec4899', '#f59e0b'] });
    setTimeout(() => fire(0.2, { spread: 60 }), 100);
    setTimeout(() => fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9 }), 200);
    setTimeout(() => fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 }), 300);
    setTimeout(() => fire(0.1, { spread: 120, startVelocity: 45 }), 400);
  }, []);

  return null;
}
