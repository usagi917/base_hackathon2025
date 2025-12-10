// 贖罪ステップコンポーネント

'use client';

import { motion } from 'framer-motion';
import { Skull } from 'lucide-react';
import { ErrorDisplay } from '../ErrorDisplay';

interface SacrificeStepProps {
  amount: string;
  onAmountChange: (value: string) => void;
  onPrev: () => void;
  onDeposit: () => void;
  error: unknown;
}

export function SacrificeStep({ amount, onAmountChange, onPrev, onDeposit, error }: SacrificeStepProps) {
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
        
        <div className="relative inline-block mb-8">
          <input
            type="number"
            step="0.001"
            min="0"
            placeholder="0.0"
            className="w-full bg-black text-green-400 border-4 border-gray-600 p-4 font-pixel text-4xl text-center outline-none focus:border-green-400"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
          />
          <div className="absolute -bottom-8 right-0 font-pixel text-xs text-gray-500">ETH</div>
        </div>
        
        <div className="bg-yellow-100 border-2 border-dashed border-yellow-600 p-4 mb-8 text-left">
          <p className="font-bold text-yellow-800 text-lg flex items-center gap-2">
            <Skull size={20} /> 警告:
          </p>
          <p className="text-sm text-yellow-800 leading-tight">
            この金額はBaseネットワーク上でロックされます。謝罪が受け入れられた場合のみ返却されます。
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={onPrev}
            className="pixel-btn"
          >
            &lt; 戻る
          </button>
          <button
            type="button"
            onClick={onDeposit}
            className="pixel-btn pixel-btn-danger hover-shake"
          >
            ETHを供物にする
          </button>
        </div>

        {Boolean(error) && <ErrorDisplay error={error} className="mt-6" />}
      </div>
    </motion.div>
  );
}

