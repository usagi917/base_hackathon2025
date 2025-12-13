// Artistic background layer (fixed, non-interactive)

'use client';

import clsx from 'clsx';
import { motion, useReducedMotion } from 'framer-motion';

import { BackgroundCursor } from './BackgroundCursor';

interface ArtBackgroundProps {
  className?: string;
}

export function ArtBackground({ className }: ArtBackgroundProps) {
  const reduceMotion = useReducedMotion();

  const float = reduceMotion
    ? undefined
    : {
        y: [0, -18, 0, 14, 0],
        x: [0, 10, 0, -10, 0],
        rotate: [0, 2, 0, -2, 0],
        scale: [1, 1.03, 1, 0.98, 1],
      };

  return (
    <div className={clsx('pointer-events-none fixed inset-0 z-0 overflow-hidden', className)}>
      {/* Big blurred blobs */}
      <motion.div
        className="absolute -top-52 -left-56 h-[720px] w-[720px] rounded-full blur-3xl por-blob-1"
        animate={float}
        transition={reduceMotion ? undefined : { duration: 16, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div
        className="absolute -top-64 -right-56 h-[760px] w-[760px] rounded-full blur-3xl por-blob-2"
        animate={float ? { ...float, x: [0, -12, 0, 12, 0] } : undefined}
        transition={reduceMotion ? undefined : { duration: 18, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-72 left-1/2 h-[820px] w-[820px] -translate-x-1/2 rounded-full blur-3xl por-blob-3"
        animate={float ? { ...float, y: [0, 14, 0, -18, 0] } : undefined}
        transition={reduceMotion ? undefined : { duration: 20, ease: 'easeInOut', repeat: Infinity }}
      />

      {/* Cursor halo (desktop only) */}
      <div className="hidden md:block">
        <BackgroundCursor />
      </div>
    </div>
  );
}
