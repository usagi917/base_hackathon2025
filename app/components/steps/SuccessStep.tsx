// Serious Pop Success Step
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Check, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { generateShareLink } from '../../utils/transaction';

interface SuccessStepProps {
  apologyId: string | null;
  onReset: () => void;
}

export function SuccessStep({ apologyId, onReset }: SuccessStepProps) {
  const [copied, setCopied] = useState(false);
  const shareLink = generateShareLink(apologyId);
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator;

  const handleCopy = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) { console.error(e); }
  };

  const handleShare = async () => {
    if (!shareLink || !canShare) return;
    try {
      await navigator.share({
        title: 'Proof of Regret',
        text: 'Judge my regret.',
        url: shareLink,
      });
    } catch (error) {
       // ignore abort
    }
  };

  return (
    <motion.div
      key="success"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full max-w-2xl mx-auto text-center"
    >
      <div className="card-pop bg-black border-[var(--color-pop-secondary)] shadow-[0_0_50px_rgba(176,38,255,0.1)] relative overflow-visible p-8 md:p-12">
        
        {/* Success Header */}
        <div className="mb-10 flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 bg-[var(--color-pop-secondary)] text-black rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_var(--color-pop-secondary)]"
          >
            <Check size={48} strokeWidth={4} />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 font-[family-name:var(--font-display)] text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-[var(--color-pop-secondary)]">
            Proof Minted
          </h1>
          <p className="text-[var(--color-pop-text-muted)] max-w-md mx-auto text-lg leading-relaxed">
            Your regret is now immutable. Share this link for judgment.
          </p>
        </div>

        {/* Share Link Area */}
        <div className="bg-[var(--color-pop-surface)] border border-[var(--color-pop-border)] mb-10 p-1">
          <div className="bg-black p-4 text-sm text-[var(--color-pop-text-muted)] font-mono break-all border border-[var(--color-pop-border)] mb-4 select-all">
            {shareLink}
          </div>

          <div className="flex flex-wrap gap-4 justify-center pb-4 px-4">
             <button
                onClick={handleCopy}
                disabled={!shareLink}
                className="btn-primary flex-1 min-w-[140px] text-xs flex items-center justify-center gap-2 py-4"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'COPIED' : 'COPY LINK'}
              </button>

              <a
                href={shareLink || '#'}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary flex-1 min-w-[140px] text-xs flex items-center justify-center gap-2 py-4"
              >
                <ExternalLink size={18} />
                OPEN
              </a>

              {canShare && (
                <button
                  onClick={handleShare}
                  disabled={!shareLink}
                  className="btn-secondary flex-1 min-w-[140px] text-xs flex items-center justify-center gap-2 py-4"
                >
                  <Share2 size={18} />
                  SHARE
                </button>
              )}
          </div>
        </div>

        {/* Footer */}
        <button
          onClick={onReset}
          className="group text-[var(--color-pop-text-muted)] hover:text-white flex items-center justify-center gap-2 mx-auto text-sm transition-all uppercase tracking-widest font-bold"
        >
          <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
          Create New Proof
        </button>

      </div>
    </motion.div>
  );
}