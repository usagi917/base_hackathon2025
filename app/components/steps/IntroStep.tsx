// イントロステップコンポーネント

'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Trophy, CheckCircle, Coins } from 'lucide-react';

interface IntroStepProps {
  isConnected: boolean;
}

export function IntroStep({ isConnected }: IntroStepProps) {
  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center space-y-12 max-w-5xl w-full"
    >
      <div className="space-y-6">
        <h1 className="display-large text-[var(--md-sys-color-primary)] font-bold mb-4 tracking-tight">
          後悔の証明
        </h1>
        <p className="headline-medium text-[var(--md-sys-color-secondary)] font-light max-w-2xl mx-auto">
          言葉は安い。証明はオンチェーン。<br/>
          <span className="text-base body-large mt-4 block text-[var(--md-sys-color-outline)]">
            真の謝罪には、犠牲が伴う。
          </span>
        </p>

        <div className="mt-8 flex justify-center">
          {!isConnected ? (
             <motion.div 
               animate={{ scale: [1, 1.05, 1] }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
               className="flex flex-col items-center gap-2 text-[var(--md-sys-color-tertiary)]"
             >
               <p className="body-large font-medium">ウォレットを接続して開始</p>
               <ArrowRight className="rotate-90" size={24} />
             </motion.div>
          ) : (
            <p className="text-[var(--md-sys-color-primary)] font-bold text-lg flex items-center gap-2 bg-[var(--md-sys-color-primary-container)] px-6 py-2 rounded-full">
              <CheckCircle size={20} /> 準備完了
            </p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
         <div className="material-card p-6 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-[var(--md-sys-color-secondary-container)] flex items-center justify-center text-[var(--md-sys-color-on-secondary-container)] mb-4">
              <CheckCircle size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-[var(--md-sys-color-on-surface)]">1. 告白</h3>
            <p className="text-[var(--md-sys-color-on-surface-variant)] leading-relaxed">
              ブロックチェーンに刻まれる言葉。<br/>
              永遠に残る、あなたの真実。
            </p>
         </div>
         <div className="material-card p-6 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-[var(--md-sys-color-secondary-container)] flex items-center justify-center text-[var(--md-sys-color-on-secondary-container)] mb-4">
              <Coins size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-[var(--md-sys-color-on-surface)]">2. 供物</h3>
            <p className="text-[var(--md-sys-color-on-surface-variant)] leading-relaxed">
              誠意の証明としてETHをロック。<br/>
              言葉だけではない、重みを。
            </p>
         </div>
         <div className="material-card p-6 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-[var(--md-sys-color-secondary-container)] flex items-center justify-center text-[var(--md-sys-color-on-secondary-container)] mb-4">
              <Trophy size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-[var(--md-sys-color-on-surface)]">3. 償還</h3>
            <p className="text-[var(--md-sys-color-on-surface-variant)] leading-relaxed">
              相手が受け入れれば返却される。<br/>
              拒絶されれば、失う。
            </p>
         </div>
      </div>
    </motion.div>
  );
}
