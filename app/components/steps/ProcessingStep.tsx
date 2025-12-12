// 処理中ステップコンポーネント

'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function ProcessingStep() {
  return (
    <motion.div
      key="processing"
      className="text-center w-full max-w-md"
    >
      <div className="material-card p-10 backdrop-blur">
        <div className="flex justify-center mb-6">
           <div className="w-16 h-16 rounded-full bg-[var(--md-sys-color-primary-container)] flex items-center justify-center text-[var(--md-sys-color-primary)]">
             <Loader2 size={32} className="animate-spin" />
           </div>
        </div>
        
        <h2 className="headline-medium text-[var(--md-sys-color-on-surface)] mb-2">処理中...</h2>
        <p className="body-large text-[var(--md-sys-color-on-surface-variant)] mb-8">
          ブロックチェーンに記録しています。<br/>
          しばらくお待ちください。
        </p>
        
        <div className="w-full bg-[var(--md-sys-color-surface-variant)] h-1 rounded-full overflow-hidden">
          <motion.div 
            className="bg-[var(--md-sys-color-primary)] h-full rounded-full"
            initial={{ width: "0%", x: "-100%" }}
            animate={{ width: "50%", x: "200%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

