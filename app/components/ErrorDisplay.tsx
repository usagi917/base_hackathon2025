// エラー表示用の共通コンポーネント

'use client';

import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { getErrorMessage } from '../utils/error';

interface ErrorDisplayProps {
  error: unknown;
  className?: string;
}

export function ErrorDisplay({ error, className }: ErrorDisplayProps) {
  if (!error) return null;

  const message = getErrorMessage(error);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 bg-[var(--md-sys-color-error-container)] rounded-lg flex items-center gap-3 text-[var(--md-sys-color-on-error-container)] font-medium ${className || ''}`}
    >
      <AlertCircle size={24} />
      <span>{message}</span>
    </motion.div>
  );
}



