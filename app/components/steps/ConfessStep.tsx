// 告白ステップコンポーネント

'use client';

import { motion } from 'framer-motion';

interface ConfessStepProps {
  message: string;
  onMessageChange: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function ConfessStep({ message, onMessageChange, onNext, onPrev }: ConfessStepProps) {
  return (
    <motion.div
      key="confess"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      className="w-full max-w-2xl"
    >
      <div className="mb-8 text-center">
        <h2 className="headline-medium text-[var(--md-sys-color-primary)] mb-2">告白</h2>
        <p className="text-[var(--md-sys-color-on-surface-variant)]">
          相手へのメッセージを入れてください。
        </p>
      </div>
      
      <div className="material-card p-8 md:p-10">
        <div className="relative mb-6">
          <textarea
            id="message"
            placeholder="本番データベースを誤って削除してしまった..."
            className="w-full h-48 bg-[var(--md-sys-color-surface-variant)] rounded-t-lg border-b-2 border-[var(--md-sys-color-on-surface-variant)] focus:border-[var(--md-sys-color-primary)] pt-12 pb-4 px-4 text-lg text-[var(--md-sys-color-on-surface)] outline-none resize-none transition-colors"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
          />
          <label 
            htmlFor="message" 
            className="absolute top-0 left-0 p-4 text-xs font-medium text-[var(--md-sys-color-primary)] pointer-events-none"
          >
            メッセージ
          </label>
        </div>

        <div className="flex justify-between items-center gap-4">
          <span className="text-sm text-[var(--md-sys-color-outline)]">
            {message.length} 文字
          </span>
          
          <div className="flex gap-4 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={onPrev}
              className="material-btn material-btn-outlined"
            >
              戻る
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!message.trim()}
              className="material-btn material-btn-filled disabled:opacity-50 disabled:shadow-none"
            >
              次へ
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

