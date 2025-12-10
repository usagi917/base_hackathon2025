// イントロステップコンポーネント

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy, Zap, Gamepad2, Skull, Coins } from 'lucide-react';

interface IntroStepProps {
  isConnected: boolean;
}

export function IntroStep({ isConnected }: IntroStepProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -50 }}
      className="text-center space-y-8 max-w-4xl w-full"
    >
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="bg-purple-600 border-4 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative"
      >
        <div className="absolute -top-6 -left-6 bg-yellow-400 border-4 border-black p-2 rotate-[-10deg] shadow-lg z-10">
           <span className="font-pixel text-xs">新着！</span>
        </div>
        
        <h1 className="text-6xl md:text-9xl font-pixel text-white text-shadow-retro leading-none mb-4 text-stroke-md">
          後悔の証明<br/>
          <span className="text-yellow-300">PROOF OF REGRET</span>
        </h1>
        
        <p className="text-2xl md:text-3xl text-white font-bold bg-black inline-block px-4 py-2 rotate-1">
          言葉は安い。証明はオンチェーン。
        </p>
        
        <div className="mt-12 space-y-4">
          {!mounted || !isConnected ? (
             <div className="animate-pulse">
               <p className="font-pixel text-xl text-yellow-300 mb-2">コインを投入（ウォレット接続）</p>
               <ArrowRight className="mx-auto rotate-90 text-white" size={40} />
             </div>
          ) : (
            <p className="font-pixel text-green-400">プレイヤー1 準備完了</p>
          )}
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
         <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
            <Gamepad2 size={32} className="mb-2" />
            <h3 className="font-pixel text-sm mb-2">1. 告白</h3>
            <p className="text-gray-600 leading-tight">ブロックチェーンに過ちを認める。</p>
         </div>
         <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
            <Coins size={32} className="mb-2" />
            <h3 className="font-pixel text-sm mb-2">2. 供物</h3>
            <p className="text-gray-600 leading-tight">誠意の証明としてETHをロックする。</p>
         </div>
         <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
            <Trophy size={32} className="mb-2" />
            <h3 className="font-pixel text-sm mb-2">3. 償還</h3>
            <p className="text-gray-600 leading-tight">許されるか、すべてを失うか。</p>
         </div>
      </div>
    </motion.div>
  );
}

