// Serious Pop Step Progress
'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Check, Coins, Link2, Loader2, MessageSquare, Wallet } from 'lucide-react';
import { Step } from '../types';

const FLOW_STEPS = [
  { step: Step.INTRO, label: 'CONNECT', icon: Wallet },
  { step: Step.CONFESS, label: 'CONFESS', icon: MessageSquare },
  { step: Step.SACRIFICE, label: 'SACRIFICE', icon: Coins },
  { step: Step.PROCESSING, label: 'MINTING', icon: Loader2 },
  { step: Step.SUCCESS, label: 'SHARE', icon: Link2 },
] as const;

function stepIndex(step: Step) {
  return FLOW_STEPS.findIndex((item) => item.step === step);
}

export function StepProgress({ step }: { step: Step }) {
  const activeIndex = Math.max(0, stepIndex(step));
  const completion = (activeIndex / (FLOW_STEPS.length - 1)) * 100;

  return (
    <motion.div 
      className="w-full mb-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="relative">
        {/* Track */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[var(--color-pop-border)] -translate-y-1/2 z-0" />
        
        {/* Active Track */}
        <motion.div 
          className="absolute top-1/2 left-0 h-0.5 bg-[var(--color-pop-primary)] -translate-y-1/2 z-0 shadow-[0_0_10px_var(--color-pop-primary)]"
          initial={{ width: 0 }}
          animate={{ width: `${completion}%` }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* Steps */}
        <div className="flex justify-between relative z-10">
          {FLOW_STEPS.map((item, index) => {
            const isActive = index === activeIndex;
            const isCompleted = index < activeIndex;
            const Icon = item.icon;

            return (
              <div key={item.step} className="flex flex-col items-center">
                <motion.div
                  className={clsx(
                    "w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border-2 transition-colors duration-300 bg-black",
                    isActive ? "border-[var(--color-pop-primary)] text-[var(--color-pop-primary)] shadow-[0_0_15px_rgba(204,255,0,0.5)]" :
                    isCompleted ? "border-[var(--color-pop-primary)] bg-[var(--color-pop-primary)] text-black" :
                    "border-[var(--color-pop-border)] text-[var(--color-pop-text-muted)]"
                  )}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                >
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : <Icon size={16} />}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}