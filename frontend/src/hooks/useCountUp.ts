import { useState, useEffect, useRef } from 'react';

export function useCountUp(target: number, duration: number = 800): number {
  const [count, setCount] = useState(0);
  const prevTargetRef = useRef(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = prevTargetRef.current;
    const change = target - startValue;

    if (change === 0) {
      setCount(target);
      return;
    }

    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing: easeOutQuad
      const easedProgress = progress * (2 - progress);
      const currentValue = startValue + easedProgress * change;
      
      // Round to 1 decimal place
      setCount(Math.round(currentValue * 10) / 10);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(target);
        prevTargetRef.current = target;
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [target, duration]);

  return count;
}
