// 贖罪ステップコンポーネント

'use client';

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { ErrorDisplay } from '../ErrorDisplay';
import { LoadingSpinner } from '../LoadingSpinner';

interface SacrificeStepProps {
  amount: string;
  onAmountChange: (value: string) => void;
  onPrev: () => void;
  onDeposit: () => void;
  error: unknown;
  isLoading?: boolean;
}

export function SacrificeStep({ amount, onAmountChange, onPrev, onDeposit, error, isLoading }: SacrificeStepProps) {
  return (
    <motion.div
      key="sacrifice"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      className="w-full max-w-2xl"
    >
      <div className="mb-8 text-center">
        <h2 className="headline-medium text-[var(--md-sys-color-primary)] mb-2">供物</h2>
        <p className="text-[var(--md-sys-color-on-surface-variant)]">
          あなたの後悔の価値を示してください。
        </p>
      </div>

      <div className="material-card p-8 md:p-10 text-center">
        
        <div className="relative flex items-center justify-center bg-[var(--md-sys-color-surface-variant)] rounded-t-lg border-b-2 border-[var(--md-sys-color-on-surface-variant)] focus-within:border-[var(--md-sys-color-primary)] p-4 mb-8 w-fit mx-auto min-w-[200px] transition-colors">
          <input
            type="number"
            step="0.001"
            min="0"
            placeholder="0.0"
            className="w-[180px] bg-transparent outline-none text-[var(--md-sys-color-primary)] text-4xl text-right font-light placeholder-[var(--md-sys-color-outline)]"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
          />
          <span className="text-xl text-[var(--md-sys-color-primary)] ml-2 font-medium">ETH</span>
        </div>
        
        <div className="bg-[var(--md-sys-color-error-container)] rounded-lg p-4 mb-8 text-left flex gap-4 items-start">
          <AlertTriangle className="text-[var(--md-sys-color-on-error-container)] flex-shrink-0" size={24} />
          <div>
            <div className="font-bold text-[var(--md-sys-color-on-error-container)] text-sm mb-1">
              警告
            </div>
            <p className="text-sm text-[var(--md-sys-color-on-error-container)] leading-relaxed">
              この金額はBaseネットワーク上でロックされます。謝罪が受け入れられた場合のみ返却されます。
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={onPrev}
            className="material-btn material-btn-outlined"
            disabled={isLoading}
          >
            戻る
          </button>
          <button
            type="button"
            onClick={onDeposit}
            disabled={isLoading}
            className="material-btn material-btn-filled min-w-[200px] disabled:opacity-50 disabled:shadow-none"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'ETHを捧げる'}
          </button>
        </div>

        {Boolean(error) && <ErrorDisplay error={error} className="mt-6" />}
      </div>
    </motion.div>
  );
}

