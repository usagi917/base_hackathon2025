// 処理中ステップコンポーネント

'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export function ProcessingStep() {
  return (
    <motion.div
      key="processing"
      className="text-center"
    >
      <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block">
        <Zap size={64} className="mx-auto mb-4 animate-bounce text-yellow-400 fill-black" />
        <h2 className="font-pixel text-2xl mb-2">ゲームを保存中...</h2>
        <p className="font-vt323 text-2xl animate-pulse">ブロックチェーンに書き込み中</p>
        
        <div className="w-full bg-gray-200 h-4 border-2 border-black mt-4">
          <motion.div 
            className="bg-green-500 h-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>
    </motion.div>
  );
}

