// Serious Pop Intro Step
'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Trophy, CheckCircle2, Coins } from 'lucide-react';

interface IntroStepProps {
  isConnected: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  },
};

export function IntroStep({ isConnected }: IntroStepProps) {
  return (
    <motion.div
      key="intro"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -20 }}
      className="w-full text-center space-y-8"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.95]">
          Words are <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-pop-text-muted)] to-white">Cheap.</span>
          <br />
          <span className="text-[var(--color-pop-primary)] glitch-hover cursor-default">
            Proof is On-Chain.
          </span>
        </h1>
        
        <p className="text-base md:text-lg text-[var(--color-pop-text-muted)] max-w-2xl mx-auto font-[family-name:var(--font-body)]">
          口先だけの謝罪に価値はない。ブロックチェーンに<span className="text-[var(--color-pop-primary)] font-bold">ETH</span>を供物として捧げ、不可逆な誠意を証明せよ。
        </p>

        <motion.div variants={itemVariants} className="pt-2">
          {!isConnected ? (
            <div className="inline-flex flex-col items-center gap-2">
              <div className="px-5 py-2 border border-[var(--color-pop-primary)] text-[var(--color-pop-primary)] font-[family-name:var(--font-display)] uppercase tracking-widest text-xs animate-pulse">
                Connect Wallet to Begin
              </div>
            </div>
          ) : (
            <div className="px-5 py-2 bg-[var(--color-pop-primary)] text-black font-bold font-[family-name:var(--font-display)] uppercase tracking-wider inline-block transform -skew-x-12 text-sm">
              <span className="block transform skew-x-12">System Ready</span>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Steps Grid */}
      <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-4 text-left">
        <StepCard 
          number="01" 
          title="Confess" 
          desc="罪の告白" 
          icon={<CheckCircle2 size={20} />}
        />
        <StepCard 
          number="02" 
          title="Sacrifice" 
          desc="供物を捧げる" 
          icon={<Coins size={20} />}
          highlight
        />
        <StepCard 
          number="03" 
          title="Judgment" 
          desc="審判を仰ぐ" 
          icon={<Trophy size={20} />}
        />
      </motion.div>
    </motion.div>
  );
}

function StepCard({ number, title, desc, icon, highlight }: { number: string; title: string; desc: string; icon: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`card-pop group transition-all duration-300 p-5 ${highlight ? 'border-[var(--color-pop-primary)]' : 'hover:border-[var(--color-pop-text-muted)]'}`}>
      <div className="flex items-start justify-between mb-3">
        <span className={`font-[family-name:var(--font-display)] text-3xl font-bold opacity-20 ${highlight ? 'text-[var(--color-pop-primary)]' : 'text-white'}`}>
          {number}
        </span>
        <div className={`${highlight ? 'text-[var(--color-pop-primary)]' : 'text-[var(--color-pop-text-muted)]'} group-hover:text-white transition-colors`}>
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-bold uppercase tracking-wider mb-1 font-[family-name:var(--font-display)]">{title}</h3>
      <p className="text-xs text-[var(--color-pop-text-muted)]">{desc}</p>
    </div>
  );
}