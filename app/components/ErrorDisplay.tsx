// Serious Pop Error Display
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
      className={`p-4 border border-[var(--color-pop-error)] bg-[var(--color-pop-error)]/10 flex items-center gap-3 text-[var(--color-pop-error)] font-bold font-mono text-sm uppercase tracking-wider ${className || ''}`}
    >
      <AlertCircle size={20} className="shrink-0" />
      <span>{message}</span>
    </motion.div>
  );
}
