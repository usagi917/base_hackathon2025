// マウスフォロワー用のカスタムフック

import { useEffect } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';
import { MOUSE_SPRING_CONFIG } from '../constants/config';

export function useMouseFollower() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, MOUSE_SPRING_CONFIG);
  const springY = useSpring(mouseY, MOUSE_SPRING_CONFIG);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return { springX, springY };
}

