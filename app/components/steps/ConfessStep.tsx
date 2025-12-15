// Serious Pop Confess Step
'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ConfessStepProps {
  message: string;
  onMessageChange: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function ConfessStep({ message, onMessageChange, onNext, onPrev }: ConfessStepProps) {
  const isValid = message.trim().length > 0 && message.length <= 300;

  return (
    <motion.div
      key="confess"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full"
    >
      <div className="card-pop bg-black p-0 overflow-hidden border-[var(--color-pop-border)]">
        {/* Text Area */}
        <textarea
          className="w-full h-[320px] bg-black p-6 text-[var(--color-pop-text)] font-[family-name:var(--font-display)] text-base resize-none focus:outline-none leading-relaxed selection:bg-[var(--color-pop-primary)] selection:text-black placeholder:text-[var(--color-pop-text-muted)]/30"
          placeholder="TYPE YOUR REGRET HERE..."
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          maxLength={300}
          spellCheck={false}
        />

        {/* Status Bar / Actions */}
        <div className="p-4 border-t border-[var(--color-pop-border)] bg-[var(--color-pop-surface)] flex justify-between items-center">
          <div className="hidden sm:flex gap-4 text-xs font-mono text-[var(--color-pop-text-muted)]">
            <span>CHARS: {message.length}/300</span>
            <span>STATUS: {isValid ? 'READY' : 'WAITING'}</span>
          </div>

          <div className="flex gap-4 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onPrev}
              className="btn-secondary text-xs py-2 px-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              BACK
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!isValid}
              className={`btn-primary text-xs py-2 px-6 ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              NEXT
              <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
      
      <p className="mt-4 text-center text-xs text-[var(--color-pop-text-muted)] font-mono uppercase tracking-widest opacity-60">
        Warning: This text will be immutable.
      </p>
    </motion.div>
  );
}

export default ConfessStep;
