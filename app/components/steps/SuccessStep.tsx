// 成功ステップコンポーネント

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Check } from 'lucide-react';
import { generateShareLink } from '../../utils/transaction';

interface SuccessStepProps {
  apologyId: string | null;
  onReset: () => void;
}

export function SuccessStep({ apologyId, onReset }: SuccessStepProps) {
  const [copied, setCopied] = useState(false);
  const shareLink = generateShareLink(apologyId);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      key="success"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-full max-w-3xl"
    >
      <div className="bg-green-400 border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center relative overflow-hidden">
        {/* Confetti-ish background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle,white_2px,transparent_1px)] bg-[size:20px_20px]" />
        
        <h1 className="font-pixel text-4xl md:text-6xl text-white text-shadow-retro mb-8 relative z-10">
          実績<br/>解除！
        </h1>
        
        <div className="bg-white border-4 border-black p-6 mb-8 transform rotate-1">
           <p className="font-vt323 text-2xl text-gray-600 mb-2">クエストアイテム獲得:</p>
           <p className="font-pixel text-sm md:text-lg break-all text-blue-600 bg-blue-100 p-2 select-all">
             {shareLink}
           </p>
           
           <button
            type="button"
            onClick={handleCopy}
            className="mt-4 w-full pixel-btn bg-yellow-300 flex items-center justify-center gap-2 hover:bg-yellow-200 transition-colors"
           >
             {copied ? <Check size={16} /> : <Share2 size={16} />}
             {copied ? 'コピーしました！' : 'クエストリンクをコピー'}
           </button>
        </div>

        <div className="relative z-10">
           <p className="font-bold text-xl mb-8">
             あなたの後悔がミントされました。リンクを共有して審判を求めましょう。
           </p>
           
           <button
             type="button"
             onClick={onReset}
             className="pixel-btn pixel-btn-primary hover-shake"
           >
             もう一度プレイ
           </button>
        </div>
      </div>
    </motion.div>
  );
}

