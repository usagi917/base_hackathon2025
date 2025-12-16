// Serious Pop Error Display
'use client';

import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { getErrorMessage } from '../utils/error';

interface ErrorDisplayProps {
  error?: unknown;
  title?: string;
  message?: string;
  className?: string;
}

export function ErrorDisplay({ error, title, message, className }: ErrorDisplayProps) {
  const resolvedMessage = message ?? (error ? getErrorMessage(error) : null);
  if (!resolvedMessage && !title) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 border border-[var(--color-pop-error)] bg-[var(--color-pop-error)]/10 flex items-center gap-3 text-[var(--color-pop-error)] font-bold font-mono text-sm uppercase tracking-wider ${className || ''}`}
    >
      <AlertCircle size={20} className="shrink-0" />
      <span className="flex flex-col gap-1">
        {title ? <span>{title}</span> : null}
        {resolvedMessage ? <span className="text-[11px] font-semibold opacity-90 normal-case tracking-normal">{resolvedMessage}</span> : null}
      </span>
    </motion.div>
  );
}




