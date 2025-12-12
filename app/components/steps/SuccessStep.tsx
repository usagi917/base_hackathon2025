// 成功ステップコンポーネント

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Check, CheckCircle2, Copy } from 'lucide-react';
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
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-full max-w-2xl"
    >
      <div className="material-card p-10 text-center overflow-hidden relative">
        <div className="flex justify-center mb-6">
           <motion.div 
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ type: "spring", duration: 0.6 }}
             className="w-20 h-20 rounded-full bg-[var(--md-sys-color-primary-container)] flex items-center justify-center text-[var(--md-sys-color-primary)]"
           >
             <CheckCircle2 size={48} />
           </motion.div>
        </div>

        <h1 className="headline-medium font-bold text-[var(--md-sys-color-on-surface)] mb-4">
          後悔が証明されました
        </h1>
        
        <p className="body-large text-[var(--md-sys-color-on-surface-variant)] mb-8">
          あなたの真実と供物はブロックチェーンに刻まれました。<br/>
          このリンクを相手に送り、審判を仰いでください。
        </p>

        <div className="bg-[var(--md-sys-color-surface-variant)] rounded-lg p-2 mb-8 flex items-center gap-2">
           <div className="flex-grow px-3 py-2 text-left overflow-x-auto whitespace-nowrap scrollbar-hide">
             <span className="text-[var(--md-sys-color-on-surface-variant)] font-mono text-sm">
               {shareLink}
             </span>
           </div>
           
           <button
            type="button"
            onClick={handleCopy}
            className="material-btn material-btn-filled !rounded-lg !px-4 !py-2 flex items-center gap-2"
           >
             {copied ? <Check size={18} /> : <Copy size={18} />}
             {copied ? 'コピー完了' : 'コピー'}
           </button>
        </div>

        <div>
           <button
             type="button"
             onClick={onReset}
             className="material-btn material-btn-outlined"
           >
             新しい証明を作成
           </button>
        </div>
      </div>
    </motion.div>
  );
}

