// 背景カーソルフォロワーコンポーネント

'use client';

import { motion } from 'framer-motion';
import { useMouseFollower } from '../hooks/useMouseFollower';
import { BACKGROUND_SIZE } from '../constants/config';

export function BackgroundCursor() {
  const { springX, springY } = useMouseFollower();

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        width: `${BACKGROUND_SIZE.width}px`,
        height: `${BACKGROUND_SIZE.height}px`,
      }}
      className="pointer-events-none fixed top-0 left-0 bg-gradient-to-r from-[var(--md-sys-color-primary)] to-[var(--md-sys-color-tertiary)] rounded-full blur-[120px] opacity-15 z-0"
    />
  );
}

