// 贖罪ステップコンポーネント

'use client';

import { motion } from 'framer-motion';
import { Skull } from 'lucide-react';
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
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="w-full max-w-2xl"
    >
      <div className="bg-pink-400 border-4 border-black p-2 mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block">
        <h2 className="font-pixel text-lg text-white">レベル2: 供物</h2>
      </div>

      <div className="bg-white border-4 border-black p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
        <p className="font-vt323 text-2xl mb-6">あなたの後悔の価値はいくらですか？</p>
        
        <div className="flex items-center justify-center bg-black border-4 border-gray-600 focus-within:border-green-400 p-4 mb-8 w-fit mx-auto gap-2">
          <input
            type="number"
            step="0.001"
            min="0"
            placeholder="0.0"
            className="w-[180px] bg-transparent outline-none text-green-400 font-pixel text-2xl md:text-4xl text-right placeholder-green-800"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
          />
          <span className="font-pixel text-2xl md:text-4xl text-green-700">ETH</span>
        </div>
        
        <div className="bg-yellow-100 border-2 border-dashed border-yellow-600 p-4 mb-8 text-left">
          <div className="font-bold text-yellow-800 text-lg flex items-center gap-2 mb-3 pb-1">
            <Skull size={20} /> 警告:
          </div>
          <p className="text-sm text-yellow-800 leading-relaxed mt-1">
            この金額はBaseネットワーク上でロックされます。謝罪が受け入れられた場合のみ返却されます。
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={onPrev}
            className="pixel-btn"
            disabled={isLoading}
          >
            &lt; 戻る
          </button>
          <button
            type="button"
            onClick={onDeposit}
            disabled={isLoading}
            className="pixel-btn pixel-btn-danger hover-shake disabled:opacity-50 disabled:cursor-wait min-w-[200px]"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'ETHを供物にする'}
          </button>
        </div>

        {Boolean(error) && <ErrorDisplay error={error} className="mt-6" />}
      </div>
    </motion.div>
  );
}

