// 成功ステップコンポーネント

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Check, CheckCircle2, Copy, ExternalLink } from 'lucide-react';
import { generateShareLink } from '../../utils/transaction';

interface SuccessStepProps {
  apologyId: string | null;
  onReset: () => void;
}

export function SuccessStep({ apologyId, onReset }: SuccessStepProps) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const shareLink = generateShareLink(apologyId);
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator;

  const handleCopy = async () => {
    if (!shareLink) return;

    setCopyFailed(false);
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback (older browsers / permission denied)
      try {
        const textarea = document.createElement('textarea');
        textarea.value = shareLink;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        setCopyFailed(true);
        setTimeout(() => setCopyFailed(false), 2500);
      }
    }
  };

  const handleShare = async () => {
    if (!shareLink) return;
    if (!canShare) return;

    try {
      await navigator.share({
        title: 'Proof of Regret',
        text: '審判をお願いします。',
        url: shareLink,
      });
    } catch (error) {
      // AbortError = user canceled share sheet
      if (error instanceof DOMException && error.name === 'AbortError') return;
    }
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

        <div className="bg-[var(--md-sys-color-surface-variant)] rounded-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row items-stretch gap-3">
            <div className="flex-grow px-3 py-3 text-left overflow-x-auto whitespace-nowrap rounded-md border border-[var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface)]">
              <span className="text-[var(--md-sys-color-on-surface-variant)] font-mono text-sm">
                {shareLink}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!shareLink}
                className="material-btn material-btn-filled !rounded-lg !px-4 !py-2 flex items-center gap-2 disabled:opacity-50 disabled:shadow-none"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'コピー完了' : 'コピー'}
              </button>

              <a
                href={shareLink || '#'}
                target="_blank"
                rel="noreferrer"
                className="material-btn material-btn-tonal !rounded-lg !px-4 !py-2 flex items-center gap-2"
                aria-disabled={!shareLink}
                onClick={(e) => {
                  if (!shareLink) e.preventDefault();
                }}
              >
                <ExternalLink size={18} />
                開く
              </a>

              {canShare && (
                <button
                  type="button"
                  onClick={handleShare}
                  disabled={!shareLink}
                  className="material-btn material-btn-outlined !rounded-lg !px-4 !py-2 flex items-center gap-2 disabled:opacity-50"
                >
                  <Share2 size={18} />
                  共有
                </button>
              )}
            </div>
          </div>

          {copyFailed && (
            <div className="mt-3 text-sm text-[var(--md-sys-color-on-error-container)] bg-[var(--md-sys-color-error-container)] rounded-md px-3 py-2">
              コピーに失敗しました。手動で選択してコピーしてください。
            </div>
          )}

          <p className="mt-3 text-xs text-[var(--md-sys-color-on-surface-variant)] text-left">
            注意：このリンクを知っている人なら誰でも審判できます。取り扱いに気をつけてください。
          </p>
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
