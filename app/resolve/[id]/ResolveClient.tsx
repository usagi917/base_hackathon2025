'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAccount, useConnect, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { formatUnits } from 'viem';
import clsx from 'clsx';
import { AlertTriangle, CheckCircle2, CircleX, Handshake, Skull, Wallet as WalletIcon } from 'lucide-react';

import { REGRET_VAULT_ABI, REGRET_VAULT_ADDRESS } from '../../constants';
import { type Apology, Outcome, type WriteError } from '../../types';
import { ErrorDisplay } from '../../components/ErrorDisplay';
import { Header } from '../../components/Header';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useBaseChainGate } from '../../hooks/useBaseChainGate';
import { getErrorMessage } from '../../utils/error';
import { DEFAULT_ASSET, findAssetByAddress } from '../../constants/assets';

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
      return '和解';
    case Outcome.Rejected:
      return '断罪';
    case Outcome.Punished:
      return '憤怒';
    default:
      return '未決';
  }
}

const DECISION_OPTIONS = [
  {
    outcome: Outcome.Forgiven,
    title: '和解',
    subtitle: '供物を受け入れる',
    description: '供物（選択された資産）があなた（審判者）に送られます。',
    icon: Handshake,
    color: 'var(--color-pop-primary)',
  },
  {
    outcome: Outcome.Rejected,
    title: '断罪',
    subtitle: '送り主へ返却',
    description: '供物を送り主に差し戻します。あなたの報酬はありません。',
    icon: CircleX,
    color: '#ffffff',
  },
  {
    outcome: Outcome.Punished,
    title: '憤怒',
    subtitle: '永遠に焼却',
    description: '供物を焼却します。誰の手にも渡りません。',
    icon: Skull,
    color: 'var(--color-pop-error)',
  },
] as const;

export function ResolveClient({ rawId }: ResolveClientProps) {
  const router = useRouter();
  const [fallbackRawId, setFallbackRawId] = useState<string | null>(null);

  const decodedId = useMemo(() => {
    try {
      return decodeURIComponent(rawId);
    } catch {
      return rawId;
    }
  }, [rawId]);

  const looksLikeValidParam = useMemo(() => {
    return /^\d+$/.test(decodedId) || /^(\d+)\W+$/u.test(decodedId);
  }, [decodedId]);

  useEffect(() => {
    if (fallbackRawId) return;
    if (looksLikeValidParam) return;
    if (typeof window === 'undefined') return;

    const match = window.location.pathname.match(/^\/resolve\/([^/?#]+)/);
    if (match?.[1]) setFallbackRawId(match[1]);
  }, [fallbackRawId, looksLikeValidParam]);

  const candidateRawId = fallbackRawId ?? rawId;

  const decodedCandidateId = useMemo(() => {
    try {
      return decodeURIComponent(candidateRawId);
    } catch {
      return candidateRawId;
    }
  }, [candidateRawId]);

  const normalizedId = useMemo(() => {
    if (/^\d+$/.test(decodedCandidateId)) return decodedCandidateId;
    const match = decodedCandidateId.match(/^(\d+)\W+$/u);
    return match?.[1] ?? null;
  }, [decodedCandidateId]);

  const needsNormalization = normalizedId !== null && decodedCandidateId !== normalizedId;

  useEffect(() => {
    if (!needsNormalization || !normalizedId) return;
    router.replace(`/resolve/${normalizedId}`);
  }, [needsNormalization, normalizedId, router]);

  const apologyId = useMemo(() => {
    if (!normalizedId) return null;
    try {
      return BigInt(normalizedId);
    } catch {
      return null;
    }
  }, [normalizedId]);

  const { isConnected } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const primaryConnector =
    connectors.find((c) => c.id === 'coinbaseWalletSDK') ||
    connectors.find((c) => c.id === 'injected') ||
    connectors[0];
  const { ensureBaseChain, isSwitchingChain, isOnBase, switchError } = useBaseChainGate();
  const [selectedDecision, setSelectedDecision] = useState<Outcome | null>(null);
  const [pendingDangerDecision, setPendingDangerDecision] = useState<Outcome | null>(null);
  const [burnConfirmText, setBurnConfirmText] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const hasMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const isWalletConnected = hasMounted ? isConnected : false;

  const { data: apology, isLoading: isReading, refetch: refetchApology } = useReadContract({
    address: REGRET_VAULT_ADDRESS,
    abi: REGRET_VAULT_ABI,
    functionName: 'getApology',
    args: [apologyId ?? BigInt(0)],
    query: { enabled: apologyId !== null, refetchInterval: 5000 },
  });

  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();
  // Force receipt polling on Polygon so we don't miss the completion event if the wallet hops chains.
  const { isLoading: isConfirming, isSuccess: isTransactionSuccess } = useWaitForTransactionReceipt({
    hash,
    chainId: polygon.id,
  });

  const apologyData = useMemo(() => apology as Apology | undefined, [apology]);
  const outcomeInt = useMemo(() => Number(apologyData?.outcome ?? Outcome.Pending), [apologyData]);
  const apologyAsset = useMemo(() => findAssetByAddress(apologyData?.asset), [apologyData?.asset]);
  const displayAsset = apologyAsset ?? DEFAULT_ASSET;
  const formattedAmount = useMemo(
    () => formatUnits(apologyData?.amountDeposited ?? 0n, displayAsset.decimals),
    [apologyData?.amountDeposited, displayAsset.decimals]
  );
  const existsOnChain = useMemo(() => {
    if (!apologyData) return false;
    return apologyData.depositedAt !== BigInt(0);
  }, [apologyData]);

  const isBusy = isPending || isConfirming || isSwitchingChain;
  const confirmDisabled = !selectedDecision || isBusy || !isWalletConnected;

  const confirmBlockedMessage = useMemo(() => {
    if (!isWalletConnected) return 'Connect wallet to judge.';
    if (!isOnBase) return 'Switch to Polygon first.';
    if (!selectedDecision) return 'Select a decision above.';
    if (isBusy) return 'Please wait…';
    return null;
  }, [isBusy, isOnBase, isWalletConnected, selectedDecision]);

  useEffect(() => {
    if (isTransactionSuccess) {
      refetchApology();
    }
  }, [isTransactionSuccess, refetchApology]);

  const handleDecision = async (decision: Outcome) => {
    setActionError(null);
    if (apologyId === null) return;
    const send = () =>
      (() => {
        try {
          writeContract({
            address: REGRET_VAULT_ADDRESS,
            abi: REGRET_VAULT_ABI,
            functionName: 'resolve',
            args: [apologyId, decision],
          });
        } catch (error) {
          setActionError(getErrorMessage(error));
        }
      })();

    const ok = await ensureBaseChain(send);
    if (!ok && !switchError) setActionError('Network switch was cancelled.');
  };

  if (isReading || needsNormalization) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </main>
    );
  }

  if (REGRET_VAULT_ADDRESS === ('0x0000000000000000000000000000000000000000' as const)) {
    return (
      <main className="min-h-screen bg-black flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <ErrorDisplay
            title="Contract not configured"
            message="Set NEXT_PUBLIC_REGRET_VAULT_V2_ADDRESS after deploying RegretVaultV2."
          />
        </div>
      </main>
    );
  }

  if (!apologyData || !existsOnChain) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <h1 className="text-white font-[family-name:var(--font-display)] text-2xl mb-4 uppercase">Proof Not Found</h1>
        <Link href="/" className="btn-secondary">Back to Home</Link>
      </main>
    );
  }

  // ALREADY RESOLVED
  if (outcomeInt !== Outcome.Pending) {
    const tokenId = apologyId?.toString() ?? decodedCandidateId;
    return (
      <main className="min-h-screen bg-black flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="card-pop bg-black border-[var(--color-pop-secondary)] p-12 text-center max-w-2xl w-full">
            <div className="w-24 h-24 rounded-full bg-[var(--color-pop-secondary)] text-white flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} />
            </div>
            <h1 className="text-4xl font-black uppercase text-white font-[family-name:var(--font-display)] mb-2">
              {outcomeLabel(outcomeInt as Outcome)}
            </h1>
            <p className="text-[var(--color-pop-text-muted)] mb-8">
              This proof has already been judged.
            </p>

            <div className="border border-[var(--color-pop-border)] bg-[var(--color-pop-surface)]/30 p-4 mb-8">
              <div className="text-xs font-mono text-[var(--color-pop-text-muted)] uppercase tracking-wider mb-3">
                Judgment SBT Preview
              </div>
              <div className="mx-auto w-full max-w-[420px] aspect-square border border-[var(--color-pop-border)] bg-black overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/image/${tokenId}`}
                  alt={`Judgment SBT #${tokenId}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-3 text-sm font-bold text-white">
                Proof of Regret — Judgment #{tokenId} — {outcomeLabel(outcomeInt as Outcome)}
              </div>
            </div>

            <Link href="/" className="btn-primary inline-flex">
              CREATE NEW PROOF
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // JUDGMENT INTERFACE
  return (
    <main className="min-h-screen bg-black text-white flex flex-col overflow-hidden">
      <Header />

      <div className="flex-1 flex flex-col justify-center p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-[1600px] mx-auto grid lg:grid-cols-[1fr_420px] gap-8 h-full min-h-[600px]">
          
          {/* LEFT: CONTEXT */}
          <div className="flex flex-col gap-6 h-full">
            {/* Amount & Sender Header */}
            <div className="flex justify-between items-end border-b border-[var(--color-pop-border)] pb-6">
              <div>
                <span className="text-[var(--color-pop-text-muted)] text-sm font-mono uppercase tracking-wider block mb-2">Offering</span>
                <div className="text-6xl md:text-8xl font-black font-[family-name:var(--font-display)] text-white leading-none">
                  {formattedAmount} <span className="text-2xl text-[var(--color-pop-text-muted)]">{displayAsset.symbol}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[var(--color-pop-text-muted)] text-sm font-mono uppercase tracking-wider block mb-2">Sender</span>
                <div className="bg-[var(--color-pop-surface)] px-4 py-2 text-sm font-mono text-[var(--color-pop-primary)] border border-[var(--color-pop-border)]">
                  {shortenAddress(apologyData.sender)}
                </div>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 border border-[var(--color-pop-border)] bg-[var(--color-pop-surface)]/30 p-8 relative overflow-hidden group">
              <span className="absolute top-4 left-4 text-[var(--color-pop-text-muted)] text-xs font-mono uppercase tracking-wider">/ MESSAGE_LOG.TXT</span>
              <div className="h-full overflow-y-auto pt-8 font-[family-name:var(--font-display)] text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
                {apologyData.message || 'NO MESSAGE ATTACHED'}
              </div>
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--color-pop-primary)]" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[var(--color-pop-primary)]" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[var(--color-pop-primary)]" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--color-pop-primary)]" />
            </div>
          </div>

          {/* RIGHT: ACTION PANEL */}
          <div className="flex flex-col h-full gap-4">
            <div className="mb-2">
              <h2 className="text-xl font-bold uppercase font-[family-name:var(--font-display)]">Judgment</h2>
              <p className="text-[var(--color-pop-text-muted)] text-sm">Choose wisely. No take-backs.</p>
            </div>

            {/* Wallet Guard */}
            {!isWalletConnected ? (
              <div className="flex-1 flex flex-col items-center justify-center border border-[var(--color-pop-border)] bg-[var(--color-pop-surface)] p-6 text-center">
                <WalletIcon size={48} className="text-[var(--color-pop-text-muted)] mb-4" />
                <p className="mb-6 font-bold">Connect Wallet to Judge</p>
                <button
                  type="button"
                  onClick={() => primaryConnector && connect({ connector: primaryConnector })}
                  disabled={isConnecting || !primaryConnector}
                  className="btn-primary w-full justify-center disabled:opacity-60"
                >
                  {isConnecting ? 'Connecting…' : 'CONNECT'}
                </button>
              </div>
            ) : !isOnBase ? (
              <div className="flex-1 flex flex-col items-center justify-center border border-[var(--color-pop-error)] bg-[var(--color-pop-error)]/10 p-6 text-center">
                <AlertTriangle size={48} className="text-[var(--color-pop-error)] mb-4" />
                <p className="mb-6 font-bold text-[var(--color-pop-error)]">Switch to Polygon</p>
                <button type="button" onClick={() => ensureBaseChain()} className="btn-secondary w-full">SWITCH NETWORK</button>
              </div>
            ) : (
              // DECISION CARDS
              <div className="flex-1 flex flex-col gap-3">
                {DECISION_OPTIONS.map((option) => {
                  const isSelected = selectedDecision === option.outcome;
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.outcome}
                      type="button"
                      onClick={() => {
                        setActionError(null);
                        setSelectedDecision(option.outcome);
                      }}
                      disabled={isBusy}
                      className={clsx(
                        "group relative flex items-center gap-4 p-5 w-full text-left transition-all duration-200 border",
                        isSelected 
                          ? "bg-[var(--color-pop-surface)] border-[var(--color-pop-primary)] shadow-[0_0_15px_rgba(204,255,0,0.2)]"
                          : "bg-black border-[var(--color-pop-border)] hover:border-[var(--color-pop-text-muted)]"
                      )}
                    >
                      <div className={clsx(
                        "w-12 h-12 flex items-center justify-center border transition-colors",
                        isSelected 
                          ? "bg-[var(--color-pop-primary)] text-black border-[var(--color-pop-primary)]"
                          : "bg-black text-[var(--color-pop-text-muted)] border-[var(--color-pop-border)] group-hover:text-white"
                      )}>
                        <Icon size={24} />
                      </div>
                      <div className="flex-1">
                        <div className={clsx(
                          "text-lg font-black font-[family-name:var(--font-display)] uppercase",
                          isSelected ? "text-[var(--color-pop-primary)]" : "text-white"
                        )}>
                          {option.title}
                        </div>
                        <div className="text-xs text-[var(--color-pop-text-muted)] font-mono">
                          {option.subtitle}
                        </div>
                      </div>
                      {isSelected && <div className="w-2 h-full absolute left-0 top-0 bg-[var(--color-pop-primary)]" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* PREVIEW & CONFIRM */}
            <div className="bg-[var(--color-pop-surface)] border border-[var(--color-pop-border)] p-5 mt-auto">
               <div className="flex justify-between items-end mb-4">
                 <span className="text-xs font-mono text-[var(--color-pop-text-muted)] uppercase">Preview</span>
                 <div className="text-right">
                   <div className="text-xs text-[var(--color-pop-text-muted)]">Result</div>
                   <div className="font-bold text-white">
                     {selectedDecision ? DECISION_OPTIONS.find(d => d.outcome === selectedDecision)?.title : 'WAITING...'}
                   </div>
                 </div>
               </div>

               <button
                 type="button"
                 aria-disabled={confirmDisabled}
                 onClick={async () => {
                   if (confirmDisabled) {
                     if (confirmBlockedMessage) setActionError(confirmBlockedMessage);
                     if (isWalletConnected && !isOnBase) void ensureBaseChain();
                     return;
                   }

                   setActionError(null);
                   if (!selectedDecision) return;
                   if (selectedDecision === Outcome.Punished) {
                     setPendingDangerDecision(Outcome.Punished);
                     return;
                   }
                   await handleDecision(selectedDecision);
                 }}
                 className={clsx(
                   "w-full btn-primary h-14 text-sm",
                   confirmDisabled && "opacity-50 cursor-not-allowed"
                 )}
               >
                 {isBusy ? <LoadingSpinner size="sm" /> : 'CONFIRM DECISION'}
               </button>

               {!isBusy && (
                 <div className="mt-3 text-xs font-mono text-[var(--color-pop-text-muted)]">
                   {!isWalletConnected
                     ? 'Connect wallet to judge.'
                     : !selectedDecision
                       ? 'Select a decision above.'
                       : !isOnBase
                        ? 'You are not on Polygon. Clicking will prompt a network switch.'
                         : null}
                 </div>
               )}

               {(actionError || switchError || writeError) && (
                 <div className="mt-4 space-y-3">
                   {actionError && (
                     <ErrorDisplay
                       title="Can’t proceed"
                       message={actionError}
                     />
                   )}
                   {switchError && (
                     <ErrorDisplay
                       title="Network switch failed"
                       message={switchError.message}
                     />
                   )}
                   {writeError && (
                     <ErrorDisplay
                       title="Transaction failed"
                       message={(writeError as WriteError).shortMessage ?? writeError.message}
                     />
                   )}
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Burn Confirmation Dialog */}
      {pendingDangerDecision === Outcome.Punished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="card-pop bg-black border-[var(--color-pop-error)] p-8 max-w-md w-full shadow-[0_0_50px_rgba(255,51,51,0.2)]">
            <h3 className="text-[var(--color-pop-error)] font-bold text-2xl mb-4 font-[family-name:var(--font-display)] uppercase flex items-center gap-2">
              <AlertTriangle /> Confirm Burn
            </h3>
            <p className="text-[var(--color-pop-text-muted)] mb-6">
              This action is <strong className="text-white">IRREVERSIBLE</strong>. The funds will be lost forever.
            </p>
            
            <input
              autoFocus
              className="w-full bg-black border border-[var(--color-pop-border)] p-4 text-center font-mono text-[var(--color-pop-error)] mb-6 focus:border-[var(--color-pop-error)] outline-none"
              placeholder="Type 'BURN' to confirm"
              value={burnConfirmText}
              onChange={(e) => setBurnConfirmText(e.target.value)}
            />

            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => {
                  setPendingDangerDecision(null);
                  setBurnConfirmText('');
                }}
                className="btn-secondary flex-1"
              >
                CANCEL
              </button>
              <button 
                type="button"
                onClick={() => handleDecision(Outcome.Punished)}
                disabled={burnConfirmText.toUpperCase() !== 'BURN' || isBusy}
                className="btn-primary flex-1 bg-[var(--color-pop-error)] border-[var(--color-pop-error)] hover:bg-[var(--color-pop-error)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                BURN IT
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
