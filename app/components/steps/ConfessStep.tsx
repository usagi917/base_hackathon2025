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
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="w-full max-w-2xl"
    >
      <div className="bg-cyan-300 border-4 border-black p-2 mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block">
        <h2 className="font-pixel text-lg">レベル1: 真実</h2>
      </div>
      
      <div className="bg-white border-4 border-black p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <label htmlFor="message" className="block font-pixel text-sm mb-4">メッセージは何ですか？</label>
        <textarea
          id="message"
          placeholder="本番データベースを誤って削除してしまった..."
          className="w-full h-48 bg-gray-100 border-4 border-gray-300 focus:border-black p-4 font-vt323 text-2xl outline-none resize-none mb-4"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
        />
        <div className="flex justify-between items-center gap-4">
          <span className="font-vt323 text-xl text-gray-500 hidden md:inline">{message.length} 文字</span>
          
          <div className="flex gap-4 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={onPrev}
              className="pixel-btn hover:bg-gray-100"
            >
              &lt; 戻る
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!message.trim()}
              className="pixel-btn pixel-btn-primary hover-shake disabled:opacity-50"
            >
              次へ {'>'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

