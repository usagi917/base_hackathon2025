// Serious Pop Processing Step
'use client';

import { motion } from 'framer-motion';

export function ProcessingStep() {
  return (
    <motion.div
      key="processing"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full max-w-lg mx-auto text-center"
    >
      <div className="card-pop bg-black border-[var(--color-pop-border)] py-16 px-8 relative overflow-hidden">
        
        {/* Loader Animation */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <motion.div 
            className="absolute inset-0 border-4 border-[var(--color-pop-border)] rounded-full"
          />
          <motion.div 
            className="absolute inset-0 border-t-4 border-[var(--color-pop-primary)] rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-4 bg-[var(--color-pop-surface)] rounded-full flex items-center justify-center font-[family-name:var(--font-display)] font-bold text-[var(--color-pop-primary)] animate-pulse"
          >
            TX
          </motion.div>
        </div>

        <h2 className="text-2xl font-bold uppercase tracking-wider mb-2 font-[family-name:var(--font-display)]">
          Minting Proof...
        </h2>
        <p className="text-[var(--color-pop-text-muted)] font-mono text-sm">
          Please wait while we inscribe your regret onto the blockchain.
        </p>

        {/* Pseudo-code output */}
        <div className="mt-8 text-left bg-[var(--color-pop-surface)] p-4 font-mono text-xs text-[var(--color-pop-text-muted)] border border-[var(--color-pop-border)]">
          <p className="text-[var(--color-pop-primary)]">{`> initiating_transaction()`}</p>
          <p className="opacity-50">{`> verifying_signature... OK`}</p>
          <p className="opacity-50">{`> locking_funds... PENDING`}</p>
          <motion.span 
            animate={{ opacity: [0, 1, 0] }} 
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-2 h-4 bg-[var(--color-pop-primary)] mt-1"
          />
        </div>
      </div>
    </motion.div>
  );
}