'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { formatEther } from 'viem';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Shield, Skull, Sword, Wallet as WalletIcon } from 'lucide-react';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';

import { REGRET_VAULT_ABI, REGRET_VAULT_ADDRESS } from '../../constants';
import { type Apology, Outcome } from '../../types';
import { ErrorDisplay } from '../../components/ErrorDisplay';
import { Header } from '../../components/Header';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useBaseChainGate } from '../../hooks/useBaseChainGate';

interface ResolveClientProps {
  rawId: string;
}

function shortenAddress(address?: string, head = 6, tail = 4) {
  if (!address) return '';
  if (address.length <= head + tail + 3) return address;
  return `${address.slice(0, head)}…${address.slice(-tail)}`;
}

function outcomeLabel(outcome: Outcome) {
  switch (outcome) {
    case Outcome.Forgiven:
      return '許された';
    case Outcome.Rejected:
      return '拒否された';
    case Outcome.Punished:
      return '罰を受けた';
    default:
      return '審判待ち';
  }
}

export function ResolveClient({ rawId }: ResolveClientProps) {
  const apologyId = useMemo(() => {
    if (!rawId) return null;
    if (!/^\d+$/.test(rawId)) return null;
    try {
      return BigInt(rawId);
    } catch {
      return null;
    }
  }, [rawId]);

  const { isConnected } = useAccount();
  const { ensureBaseChain, isSwitchingChain, isOnBase } = useBaseChainGate();
  const [pendingDangerDecision, setPendingDangerDecision] = useState<Outcome | null>(null);

  const { data: apology, isLoading: isReading, refetch: refetchApology } = useReadContract({
    address: REGRET_VAULT_ADDRESS,
    abi: REGRET_VAULT_ABI,
    functionName: 'getApology',
    args: [apologyId ?? BigInt(0)],
    query: { enabled: apologyId !== null, refetchInterval: 2000 }, // 2秒ごとに自動再フェッチ
  });

  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isTransactionSuccess } = useWaitForTransactionReceipt({ hash });

  const apologyData = useMemo(() => apology as Apology | undefined, [apology]);
  const outcomeInt = useMemo(() => Number(apologyData?.outcome ?? Outcome.Pending), [apologyData]);
  const existsOnChain = useMemo(() => {
    if (!apologyData) return false;
    // getApology() は存在しないIDでもデフォルト値を返すため、timestamp で存在判定する
    return apologyData.timestamp !== BigInt(0);
  }, [apologyData]);

  const isBusy = isPending || isConfirming || isSwitchingChain;

  // トランザクションが成功したら即座に再フェッチ
  useEffect(() => {
    if (isTransactionSuccess) {
      refetchApology();
    }
  }, [isTransactionSuccess, refetchApology]);

  const handleDecision = async (decision: Outcome) => {
    if (!apologyId) return;

    const send = () =>
      writeContract({
        address: REGRET_VAULT_ADDRESS,
        abi: REGRET_VAULT_ABI,
        functionName: 'resolve',
        args: [apologyId, decision],
      });

    await ensureBaseChain(send);
  };

  if (!rawId || apologyId === null) {
    return (
      <main className="relative min-h-screen w-full flex flex-col">
        <Header />
        <div className="relative z-10 flex-grow flex items-center justify-center p-4 py-24 md:py-32">
          <div className="w-full max-w-xl material-card p-8 text-center">
            <h1 className="headline-medium font-bold text-[var(--md-sys-color-on-surface)] mb-2">
              リンクが不正です
            </h1>
            <p className="body-large text-[var(--md-sys-color-on-surface-variant)]">
              共有URLを確認して、もう一度開いてください。
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (isReading) {
    return (
      <main className="relative min-h-screen w-full flex flex-col">
        <Header />
        <div className="relative z-10 flex-grow flex items-center justify-center p-4 py-24 md:py-32">
          <div className="w-full max-w-xl material-card p-10 text-center">
            <div className="flex justify-center mb-6 text-[var(--md-sys-color-primary)]">
              <LoadingSpinner size="lg" />
            </div>
            <h1 className="headline-medium text-[var(--md-sys-color-on-surface)] mb-2">読み込み中...</h1>
            <p className="body-large text-[var(--md-sys-color-on-surface-variant)]">
              ブロックチェーンから内容を取得しています。
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!apologyData || !existsOnChain) {
    return (
      <main className="relative min-h-screen w-full flex flex-col">
        <Header />
        <div className="relative z-10 flex-grow flex items-center justify-center p-4 py-24 md:py-32">
          <div className="w-full max-w-xl material-card p-8 text-center">
            <h1 className="headline-medium font-bold text-[var(--md-sys-color-on-surface)] mb-2">
              証明が見つかりません
            </h1>
            <p className="body-large text-[var(--md-sys-color-on-surface-variant)] mb-6">
              IDが間違っているか、まだ反映されていない可能性があります。
            </p>
            <Link href="/" className="material-btn material-btn-outlined">
              トップへ戻る
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Resolution Screen (Outcome)
  if (outcomeInt !== Outcome.Pending) {
    return (
      <main className="relative min-h-screen w-full flex flex-col">
        <Header />

        <div className="relative z-10 flex-grow flex flex-col items-center justify-center p-4 py-24 md:py-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
            <div className="material-card p-10 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-[var(--md-sys-color-primary-container)] flex items-center justify-center text-[var(--md-sys-color-primary)]">
                  <CheckCircle2 size={44} />
                </div>
              </div>

              <h1 className="headline-medium font-bold text-[var(--md-sys-color-on-surface)] mb-2">
                {outcomeLabel(outcomeInt as Outcome)}
              </h1>
              <p className="body-large text-[var(--md-sys-color-on-surface-variant)] mb-8">
                この証明はすでに審判済みです。
              </p>

              <div className="flex justify-center">
                <Link href="/" className="material-btn material-btn-filled">
                  新しい証明を作成
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  const statusMessage = isSwitchingChain
    ? 'ネットワーク切替中...'
    : isPending
      ? 'ウォレットを確認してください...'
      : isConfirming
        ? 'トランザクション処理中...'
        : null;

  // Active Screen (Judgment)
  return (
    <main className="relative min-h-screen w-full flex flex-col">
      <Header />

      <div className="relative z-10 flex-grow flex flex-col items-center justify-center p-4 py-24 md:py-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl">
          <div className="mb-8 text-center">
            <h1 className="display-large text-[var(--md-sys-color-primary)] font-bold mb-3">審判を下す</h1>
            <p className="headline-medium text-[var(--md-sys-color-on-surface-variant)] max-w-3xl mx-auto">
              このリンクを開いたアカウントが審判者になります。
              <br />
              あなたの選択で供物（ETH）の行方が決まります。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="material-card p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm text-[var(--md-sys-color-outline)] mb-1">供物</p>
                  <div className="text-4xl font-bold text-[var(--md-sys-color-on-surface)]">
                    {formatEther(apologyData.amount)}{' '}
                    <span className="text-base font-medium text-[var(--md-sys-color-on-surface-variant)]">ETH</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[var(--md-sys-color-outline)] mb-1">送信者</p>
                  <div className="font-mono text-sm px-3 py-2 rounded-md bg-[var(--md-sys-color-surface-variant)] text-[var(--md-sys-color-on-surface)]">
                    {shortenAddress(apologyData.sender)}
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-[var(--md-sys-color-surface-variant)] border border-[var(--md-sys-color-outline)] p-4">
                <p className="text-sm text-[var(--md-sys-color-outline)] mb-2">メッセージ</p>
                <p className="whitespace-pre-wrap text-[var(--md-sys-color-on-surface)] leading-relaxed">
                  {apologyData.message || '（メッセージなし）'}
                </p>
              </div>
            </div>

            <div className="material-card p-8">
              <div className="mb-6">
                <h2 className="headline-medium text-[var(--md-sys-color-on-surface)] mb-2">アクション</h2>
                <p className="text-[var(--md-sys-color-on-surface-variant)]">一度だけ選べます。やり直しはできません。</p>
              </div>

              {!isConnected && (
                <div className="rounded-lg border border-[var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-variant)] p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <WalletIcon className="text-[var(--md-sys-color-primary)] mt-0.5" size={20} />
                    <div className="flex-1">
                      <p className="font-bold text-[var(--md-sys-color-on-surface)] mb-1">
                        審判するにはウォレット接続が必要です
                      </p>
                      <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] mb-3">
                        接続したアカウントが審判者になります。
                      </p>
                      <Wallet>
                        <ConnectWallet className="material-btn material-btn-filled !px-4 !py-2 w-full justify-center">
                          ウォレットを接続
                        </ConnectWallet>
                      </Wallet>
                    </div>
                  </div>
                </div>
              )}

              {isConnected && !isOnBase && (
                <div className="rounded-lg border border-[var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-variant)] p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-[var(--md-sys-color-primary)] mt-0.5" size={20} />
                    <div className="flex-1">
                      <p className="font-bold text-[var(--md-sys-color-on-surface)] mb-1">
                        Base Sepolia に切り替えてください
                      </p>
                      <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] mb-3">
                        ボタンを押すとネットワーク切替をリクエストします。
                      </p>
                      <button
                        type="button"
                        onClick={() => ensureBaseChain()}
                        className="material-btn material-btn-outlined w-full justify-center"
                        disabled={isBusy}
                      >
                        {isSwitchingChain ? <LoadingSpinner size="sm" /> : 'Base Sepolia へ切替'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleDecision(Outcome.Forgiven)}
                  disabled={!isConnected || isBusy}
                  className={clsx(
                    'material-btn w-full !justify-between !px-5',
                    'material-btn-filled disabled:opacity-50 disabled:shadow-none'
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Shield size={18} />
                    許す
                  </span>
                  <span className="text-xs opacity-80">供物を受け取る</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDecision(Outcome.Rejected)}
                  disabled={!isConnected || isBusy}
                  className={clsx(
                    'material-btn w-full !justify-between !px-5',
                    'material-btn-tonal disabled:opacity-50 disabled:shadow-none'
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Sword size={18} />
                    拒否
                  </span>
                  <span className="text-xs opacity-80">送信者に返却</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPendingDangerDecision(Outcome.Punished)}
                  disabled={!isConnected || isBusy}
                  className={clsx(
                    'material-btn w-full !justify-between !px-5',
                    'material-btn-outlined disabled:opacity-50 disabled:shadow-none',
                    'border-[var(--md-sys-color-error)] text-[var(--md-sys-color-error)] hover:bg-[rgba(255,68,68,0.12)]'
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Skull size={18} />
                    罰する
                  </span>
                  <span className="text-xs opacity-80">永久に焼却</span>
                </button>
              </div>

              {statusMessage && (
                <div className="mt-5 text-center text-sm text-[var(--md-sys-color-on-surface-variant)]">{statusMessage}</div>
              )}

              {writeError && <ErrorDisplay error={writeError} className="mt-5" />}
            </div>
          </div>
        </motion.div>
      </div>

      {pendingDangerDecision === Outcome.Punished && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-lg material-card p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-[var(--md-sys-color-error)]" size={22} />
                <h3 className="headline-medium text-[var(--md-sys-color-on-surface)]">本当に焼却しますか？</h3>
              </div>
              <button
                type="button"
                className="material-btn material-btn-tonal !px-3 !py-2"
                onClick={() => setPendingDangerDecision(null)}
                disabled={isBusy}
              >
                閉じる
              </button>
            </div>

            <p className="text-[var(--md-sys-color-on-surface-variant)] mb-4">
              供物は永久に失われます。誰も受け取れません。
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                className="material-btn material-btn-tonal w-full justify-center"
                onClick={() => setPendingDangerDecision(null)}
                disabled={isBusy}
              >
                やめる
              </button>
              <button
                type="button"
                className="material-btn w-full justify-center border border-[var(--md-sys-color-error)] bg-[var(--md-sys-color-error)] text-black disabled:opacity-50"
                onClick={async () => {
                  setPendingDangerDecision(null);
                  await handleDecision(Outcome.Punished);
                }}
                disabled={isBusy || !isConnected}
              >
                {isBusy ? <LoadingSpinner size="sm" /> : '焼却する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

